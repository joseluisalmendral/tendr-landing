import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Section } from "@/components/landing/Section";

describe("Section", () => {
  it("S1: renders exactly one <h2> whose text === heading", () => {
    const { container } = render(
      <Section heading="Cómo funciona">
        <p>body</p>
      </Section>,
    );
    const headings = container.querySelectorAll("h2");
    expect(headings).toHaveLength(1);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveTextContent("Cómo funciona");
  });

  it("renders a <section> element", () => {
    const { container } = render(
      <Section heading="Precios">
        <p>body</p>
      </Section>,
    );
    expect(container.querySelector("section")).not.toBeNull();
  });

  it("S2: eyebrow renders and precedes the h2 when provided", () => {
    render(
      <Section heading="Lo que dicen" eyebrow="Testimonios">
        <p>body</p>
      </Section>,
    );
    const eyebrow = screen.getByText("Testimonios");
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(eyebrow).toBeInTheDocument();
    // DOM order: eyebrow precedes the heading.
    expect(
      eyebrow.compareDocumentPosition(h2) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("S2: no eyebrow node when omitted", () => {
    render(
      <Section heading="Sin eyebrow">
        <p>body</p>
      </Section>,
    );
    expect(screen.queryByText("Testimonios")).not.toBeInTheDocument();
  });

  it("S3: applies id to the <section> when provided", () => {
    const { container } = render(
      <Section id="pricing" heading="Precios">
        <p>body</p>
      </Section>,
    );
    expect(container.querySelector("section")?.getAttribute("id")).toBe(
      "pricing",
    );
  });

  it("S4: renders children inside the section", () => {
    render(
      <Section heading="Con hijos">
        <p data-testid="child">contenido del cuerpo</p>
      </Section>,
    );
    const child = screen.getByTestId("child");
    expect(child).toHaveTextContent("contenido del cuerpo");
    expect(child.closest("section")).not.toBeNull();
  });

  it("a11y: has no axe violations", async () => {
    const { container } = render(
      <Section id="faq" heading="Preguntas frecuentes" eyebrow="Dudas">
        <p>Respuesta de ejemplo.</p>
      </Section>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
