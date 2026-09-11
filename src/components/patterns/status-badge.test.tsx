import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("affiche le libellé fourni", () => {
    render(<StatusBadge status="paid" label="Payé" />);
    expect(screen.getByText("Payé")).toBeInTheDocument();
  });

  it("affiche une icône étoile uniquement pour le statut premium", () => {
    const { container: withoutStar } = render(
      <StatusBadge status="paid" label="Payé" />,
    );
    expect(withoutStar.querySelector("svg")).not.toBeInTheDocument();

    const { container: withStar } = render(
      <StatusBadge status="premium" label="Premium" />,
    );
    expect(withStar.querySelector("svg")).toBeInTheDocument();
  });
});
