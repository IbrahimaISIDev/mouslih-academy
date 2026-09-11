import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./progress-bar";

describe("ProgressBar", () => {
  it("affiche le libellé fourni", () => {
    render(<ProgressBar percent={45} label="5 / 11 · 45 %" />);
    expect(screen.getByText("5 / 11 · 45 %")).toBeInTheDocument();
  });

  it("fixe la largeur du remplissage à la valeur du pourcentage", () => {
    const { container } = render(<ProgressBar percent={45} />);
    const fill = container.querySelector("div.h-full") as HTMLDivElement;
    expect(fill.style.width).toBe("45%");
  });

  it("borne le pourcentage entre 0 et 100", () => {
    const { container: over } = render(<ProgressBar percent={140} />);
    expect(
      (over.querySelector("div.h-full") as HTMLDivElement).style.width,
    ).toBe("100%");

    const { container: under } = render(<ProgressBar percent={-10} />);
    expect(
      (under.querySelector("div.h-full") as HTMLDivElement).style.width,
    ).toBe("0%");
  });

  it("affiche le pourcentage au centre en variante circulaire", () => {
    render(<ProgressBar percent={45} variant="circular" />);
    expect(screen.getByText("45%")).toBeInTheDocument();
  });
});
