import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "@/components/a11y/SkipLink";

// Smoke test: proves the Vitest + RTL + jest-dom harness renders a real Server
// Component and resolves the @/ path alias. SkipLink exposes its accessible name
// via aria-label, which overrides the visible text per the accname algorithm.
describe("SkipLink (harness smoke test)", () => {
  it("renders an accessible skip link to the main content", () => {
    render(<SkipLink />);

    const link = screen.getByRole("link", {
      name: "Saltar al contenido principal",
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#main");
  });
});
