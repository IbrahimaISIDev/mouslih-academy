import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { CourseEditorData } from "./get-course-editor";

/** Paramètres signés par le backend pour un envoi direct navigateur → Cloudinary. */
interface CloudinaryUploadParams {
  uploadUrl: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  fields: Record<string, string>;
  publicId: string;
}

export interface LessonRef {
  courseId: string;
  moduleId: string;
  subModuleId: string;
  lessonId: string;
}

function lessonPath({ courseId, moduleId, subModuleId, lessonId }: LessonRef) {
  return `/api/admin/courses/${courseId}/modules/${moduleId}/submodules/${subModuleId}/lessons/${lessonId}`;
}

/** Morceaux de 20 Mo : au-dessus du minimum Cloudinary (5 Mo), assez petits pour qu'une coupure
 *  réseau ne fasse perdre qu'un morceau, pas tout l'envoi. */
const CHUNK_SIZE = 20 * 1024 * 1024;
const MAX_ATTEMPTS = 3;

/** Refus définitif de Cloudinary (clé, signature, fichier refusé…) : réessayer n'y changerait
 *  rien, contrairement à une coupure réseau ou une erreur passagère (5xx). */
class UploadRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadRejectedError";
  }
}

export class UploadAbortedError extends Error {
  constructor() {
    super("Envoi annulé.");
    this.name = "UploadAbortedError";
  }
}

function postChunk(
  params: CloudinaryUploadParams,
  file: File,
  start: number,
  end: number,
  uploadId: string,
  onChunkProgress: (loaded: number) => void,
  signal: AbortSignal,
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file.slice(start, end), file.name);
    form.append("api_key", params.apiKey);
    form.append("timestamp", String(params.timestamp));
    form.append("signature", params.signature);
    for (const [key, value] of Object.entries(params.fields))
      form.append(key, value);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", params.uploadUrl);
    if (file.size > CHUNK_SIZE) {
      xhr.setRequestHeader("X-Unique-Upload-Id", uploadId);
      xhr.setRequestHeader(
        "Content-Range",
        `bytes ${start}-${end - 1}/${file.size}`,
      );
    }
    xhr.upload.onprogress = (event) => onChunkProgress(event.loaded);
    xhr.onload = () => {
      let body: Record<string, unknown> = {};
      try {
        body = JSON.parse(xhr.responseText) as Record<string, unknown>;
      } catch {
        // Réponse non JSON : traitée comme une erreur ci-dessous.
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body);
      } else {
        const message = (body.error as { message?: string } | undefined)
          ?.message;
        const text = message ?? `Cloudinary a refusé l'envoi (${xhr.status}).`;
        reject(
          xhr.status >= 500 ? new Error(text) : new UploadRejectedError(text),
        );
      }
    };
    xhr.onerror = () =>
      reject(new Error("Connexion interrompue pendant l'envoi."));
    signal.addEventListener("abort", () => {
      xhr.abort();
      reject(new UploadAbortedError());
    });
    xhr.send(form);
  });
}

/**
 * Envoie une vidéo de leçon : signature par le backend, envoi direct (par morceaux) vers
 * Cloudinary, puis confirmation au backend qui vérifie la vidéo et lit sa durée.
 */
export async function uploadLessonVideo(
  ref: LessonRef,
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
): Promise<CourseEditorData> {
  if (USE_MOCKS) {
    throw new Error(
      "Envoi indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).",
    );
  }

  const params = await clientApiFetch<CloudinaryUploadParams>(
    `${lessonPath(ref)}/video-upload`,
    {
      method: "POST",
    },
  );

  const uploadId = `${params.publicId.replace(/\W/g, "-")}-${Date.now()}`;
  let result: Record<string, unknown> = {};
  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    for (let attempt = 1; ; attempt++) {
      if (signal.aborted) throw new UploadAbortedError();
      try {
        result = await postChunk(
          params,
          file,
          start,
          end,
          uploadId,
          (loaded) =>
            onProgress(
              Math.min(99, Math.round(((start + loaded) / file.size) * 100)),
            ),
          signal,
        );
        break;
      } catch (error) {
        if (
          error instanceof UploadAbortedError ||
          error instanceof UploadRejectedError ||
          attempt >= MAX_ATTEMPTS
        )
          throw error;
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
  }
  onProgress(100);

  const publicId =
    typeof result.public_id === "string" ? result.public_id : params.publicId;
  return clientApiFetch<CourseEditorData>(
    `${lessonPath(ref)}/video-upload/complete`,
    {
      method: "POST",
      body: JSON.stringify({ publicId }),
    },
  );
}

/** Change seulement l'accès libre d'une leçon (sans toucher à sa vidéo). */
export async function updateLessonAccess(
  ref: LessonRef,
  isFreePreview: boolean,
): Promise<CourseEditorData> {
  if (USE_MOCKS) {
    throw new Error(
      "Modification indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).",
    );
  }
  return clientApiFetch<CourseEditorData>(lessonPath(ref), {
    method: "PATCH",
    body: JSON.stringify({ isFreePreview }),
  });
}
