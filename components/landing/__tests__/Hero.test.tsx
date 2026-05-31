import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/landing/Hero";
import type { HeroProps } from "@/components/landing/types";

const props: HeroProps = {
  title: "El mini-CRM para tu cartera de clientes freelance",
  subtitle:
    "Ordená leads, propuestas y cobros en un pipeline visual. Sin hojas de cálculo ni recordatorios perdidos.",
  ctaPrimary: { label: "Empezá gratis", href: "/signup" },
  ctaSecondary: { label: "Ver cómo funciona", href: "/demo" },
  image: {
    src: "/hero-pipeline-empty.png",
    alt: "Vista del pipeline de clientes vacío en Tendr",
    width: 720,
    height: 600,
  },
};

describe("Hero", () => {
  it("renders exactly one <h1> with the title (the page's only h1)", () => {
    const { container } = render(<Hero {...props} />);

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(props.title);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the subtitle", () => {
    render(<Hero {...props} />);
    expect(screen.getByText(props.subtitle)).toBeInTheDocument();
  });

  it("renders both CTA links with their labels and hrefs", () => {
    render(<Hero {...props} />);

    const primary = screen.getByRole("link", { name: props.ctaPrimary.label });
    const secondary = screen.getByRole("link", {
      name: props.ctaSecondary.label,
    });

    expect(primary).toHaveAttribute("href", props.ctaPrimary.href);
    expect(secondary).toHaveAttribute("href", props.ctaSecondary.href);
  });

  it("renders the faux-UI image with its alt and reserved width/height (CLS 0)", () => {
    render(<Hero {...props} />);

    const img = screen.getByAltText(props.image.alt);
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("width", String(props.image.width));
    expect(img).toHaveAttribute("height", String(props.image.height));
  });

  it("primary CTA carries the rounded-cta and accent token classes", () => {
    render(<Hero {...props} />);

    const primary = screen.getByRole("link", { name: props.ctaPrimary.label });
    expect(primary.className).toContain("rounded-cta");
    expect(primary.className).toContain("bg-accent-primary");
    expect(primary.className).toContain("text-on-accent");
    expect(primary.className).toContain("shadow-hard");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Hero {...props} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
