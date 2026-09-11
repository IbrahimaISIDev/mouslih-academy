import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LevelBadge } from "./level-badge";

describe("LevelBadge", () => {
  it("affiche le libellé fourni", () => {
    render(<LevelBadge level="intermediate" label="Intermédiaire" />);
    expect(screen.getByText("Intermédiaire")).toBeInTheDocument();
  });

  it("remplit une seule barrette pour le niveau débutant", () => {
    const { container } = render(
      <LevelBadge level="beginner" label="Débutant" />,
    );
    const bars = container.querySelectorAll("span.h-2\\.5");
    expect(bars).toHaveLength(3);
    const solidFilled = Array.from(bars).filter(
      (bar) =>
        bar.className.includes("bg-green-700") &&
        !bar.className.includes("bg-green-700/"),
    );
    expect(solidFilled).toHaveLength(1);
  });

  it("remplit les trois barrettes pour le niveau avancé", () => {
    const { container } = render(
      <LevelBadge level="advanced" label="Avancé" />,
    );
    const bars = container.querySelectorAll("span.h-2\\.5");
    const solidFilled = Array.from(bars).filter(
      (bar) =>
        bar.className.includes("bg-green-700") &&
        !bar.className.includes("bg-green-700/"),
    );
    expect(solidFilled).toHaveLength(3);
  });
});
