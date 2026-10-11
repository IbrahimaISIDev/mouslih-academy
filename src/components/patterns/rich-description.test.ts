import { describe, expect, it } from "vitest";
import { parseDescription } from "./rich-description";

describe("parseDescription", () => {
  it("sépare paragraphe d'introduction et liste à puces", () => {
    expect(
      parseDescription(
        "Erreurs fréquentes :\n- une lettre remplacée ;\n- une shadda oubliée.",
      ),
    ).toEqual([
      { kind: "paragraph", text: "Erreurs fréquentes :" },
      {
        kind: "list",
        items: ["une lettre remplacée ;", "une shadda oubliée."],
      },
    ]);
  });

  it("garde les paragraphes séparés par une ligne vide", () => {
    expect(parseDescription("Premier.\n\nSecond.")).toEqual([
      { kind: "paragraph", text: "Premier." },
      { kind: "paragraph", text: "Second." },
    ]);
  });

  it("reste compatible avec un texte sans liste (description existante)", () => {
    expect(parseDescription("Une seule phrase.")).toEqual([
      { kind: "paragraph", text: "Une seule phrase." },
    ]);
  });

  it("n'interprète pas un tiret au milieu d'une ligne comme une puce", () => {
    expect(parseDescription("Al-Fâtiḥah — une sourate")).toEqual([
      { kind: "paragraph", text: "Al-Fâtiḥah — une sourate" },
    ]);
  });
});
