import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { FAQ } from "@/components/landing/FAQ";
import type { FaqProps } from "@/components/landing/types";

// Realistic sub-query questions a freelancer would actually type into a search
// or answer engine, not "¿Qué es Tendr?". These exercise the GEO surface.
const props: FaqProps = {
  items: [
    {
      question: "¿En qué se diferencia de HubSpot?",
      answer:
        "Tendr está pensado para freelancers junior: una sola persona, sin equipo de ventas ni configuración compleja. HubSpot escala para equipos; Tendr arranca contigo en minutos.",
    },
    {
      question: "¿Puedo importar mis clientes por CSV?",
      answer:
        "Sí. Subes un CSV con nombre, email y empresa, y Tendr crea las fichas de cliente automáticamente, sin perder los seguimientos que ya tenías anotados.",
    },
    {
      question: "¿Funciona si solo tengo cinco clientes?",
      answer:
        "Funciona desde el primer cliente. El plan gratuito cubre cartera pequeña sin límite de tiempo, así que puedes ordenar tu trabajo aunque empieces hoy.",
    },
  ],
};

describe("FAQ", () => {
  it("renders one accordion trigger per item with the question as its name", () => {
    render(<FAQ {...props} />);

    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(props.items.length);

    for (const item of props.items) {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument();
    }
  });

  it("emits exactly one FAQPage JSON-LD whose mainEntity mirrors every item", () => {
    const { container } = render(<FAQ {...props} />);

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);

    const data = JSON.parse(scripts[0].textContent ?? "");

    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(props.items.length);

    props.items.forEach((item, i) => {
      const entity = data.mainEntity[i];
      expect(entity["@type"]).toBe("Question");
      expect(entity.name).toBe(item.question);
      expect(entity.acceptedAnswer.text).toBe(item.answer);
    });
  });

  it("does not declare its own 'use client' directive (stays a Server Component)", () => {
    const source = readFileSync(
      join(process.cwd(), "components/landing/FAQ.tsx"),
      "utf8",
    );
    // Only flag a real directive prologue (a statement line), not a prose
    // mention inside a doc comment.
    expect(source).not.toMatch(/^\s*['"]use client['"]\s*;?\s*$/m);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<FAQ {...props} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
