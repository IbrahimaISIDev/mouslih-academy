/**
 * Point de bascule unique entre fixtures et backend réel. Chaque fonction de
 * `features/.../api` a la même signature dans les deux modes ; brancher le vrai
 * backend ne touche donc aucun composant, seulement ces fichiers.
 */
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${init?.method ?? "GET"} ${path} → ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
