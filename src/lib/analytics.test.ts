import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn(() => Promise.resolve(new Response(null)));

async function loadTrack() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
  return import("./analytics");
}

function sentBody(call = 0): Record<string, unknown> {
  const init = (
    fetchMock.mock.calls[call] as unknown as [string, RequestInit]
  )[1];
  return JSON.parse(init.body as string) as Record<string, unknown>;
}

function visit(url: string, referrer = "") {
  window.history.replaceState(null, "", url);
  Object.defineProperty(document, "referrer", {
    value: referrer,
    configurable: true,
  });
}

describe("track", () => {
  beforeEach(() => {
    sessionStorage.clear();
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("envoie un événement sans cookie, en texte, vers l'API", async () => {
    visit("/fr");
    const { track } = await loadTrack();
    track("page_view");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.example.test/api/analytics/events");
    expect(init).toMatchObject({
      method: "POST",
      mode: "no-cors",
      credentials: "omit",
      keepalive: true,
    });
    expect(sentBody()).toMatchObject({
      name: "page_view",
      path: "/fr",
      source: "direct",
    });
  });

  it("déduit la provenance du lien utm puis la garde pour toute la visite", async () => {
    visit(
      "/fr/formations/rectification-fatiha?utm_source=TikTok&utm_campaign=lancement",
    );
    const { track } = await loadTrack();
    track("page_view");
    visit("/fr/inscription", "https://mouslih-academy.vercel.app/fr");
    track("signup");
    expect(sentBody(0)).toMatchObject({
      source: "tiktok",
      utmCampaign: "lancement",
    });
    expect(sentBody(1)).toMatchObject({ source: "tiktok", name: "signup" });
    expect(sentBody(0).sessionId).toBe(sentBody(1).sessionId);
    // Jamais de paramètres d'URL dans le chemin envoyé.
    expect(sentBody(0).path).toBe("/fr/formations/rectification-fatiha");
  });

  it("reconnaît WhatsApp par le site d'origine", async () => {
    visit("/fr", "https://l.wa.me/");
    const { track } = await loadTrack();
    track("page_view");
    expect(sentBody()).toMatchObject({ source: "whatsapp" });
  });

  it("ne mesure pas l'espace d'administration", async () => {
    visit("/fr/admin/audience");
    const { track } = await loadTrack();
    track("page_view");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("trackOnce n'envoie qu'une fois par clé", async () => {
    visit("/fr/commande/ref/confirmation");
    const { trackOnce } = await loadTrack();
    trackOnce("paid_A1", "payment_success");
    trackOnce("paid_A1", "payment_success");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
