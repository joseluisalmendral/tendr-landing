import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { LightningIcon } from "@phosphor-icons/react";

import { Feature } from "@/components/landing/Feature";
import type { FeatureProps } from "@/components/landing/types";

const iconVisual: FeatureProps["visual"] = { kind: "icon", icon: LightningIcon };

const imageVisual: FeatureProps["visual"] = {
  kind: "image",
  src: "/features/pipeline.webp",
  alt: "Tablero de pipeline con tres oportunidades",
  width: 320,
  height: 240,
};

function renderFeature(overrides: Partial<FeatureProps> = {}) {
  const props: FeatureProps = {
    title: "Seguimiento sin fricción",
    description: "Mové cada oportunidad por el pipeline con un solo gesto.",
    visual: iconVisual,
    ...overrides,
  };
  return render(<Feature {...props} />);
}

describe("Feature", () => {
  it("renders the title inside the only <h3>", () => {
    const { container } = renderFeature({ title: "Pipeline visual" });

    const headings = container.querySelectorAll("h3");
    expect(headings).toHaveLength(1);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Pipeline visual");
  });

  it("renders the description text", () => {
    renderFeature({
      description: "Mové cada oportunidad por el pipeline con un solo gesto.",
    });

    expect(
      screen.getByText(
        "Mové cada oportunidad por el pipeline con un solo gesto.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the Phosphor icon (an <svg>) and no <img> for the icon variant", () => {
    const { container } = renderFeature({ visual: iconVisual });

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders next/image with the correct alt, width and height for the image variant", () => {
    renderFeature({ visual: imageVisual });

    const img = screen.getByRole("img", {
      name: "Tablero de pipeline con tres oportunidades",
    });
    expect(img).toHaveAttribute("alt", imageVisual.alt);
    expect(img).toHaveAttribute("width", "320");
    expect(img).toHaveAttribute("height", "240");
    expect(img).toHaveAttribute("src", "/features/pipeline.webp");
  });

  it("renders the optional link as an anchor with the right name and href", () => {
    renderFeature({ link: { label: "Ver cómo funciona", href: "/funciona" } });

    const link = screen.getByRole("link", { name: "Ver cómo funciona" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/funciona");
  });

  it("does not render any link when none is provided", () => {
    renderFeature({ link: undefined });

    expect(screen.queryByRole("link")).toBeNull();
  });

  it("has no accessibility violations (icon variant)", async () => {
    const { container } = renderFeature({ visual: iconVisual });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations (image variant with link)", async () => {
    const { container } = renderFeature({
      visual: imageVisual,
      link: { label: "Ver cómo funciona", href: "/funciona" },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes the title heading inside the rendered article", () => {
    const { container } = renderFeature();
    const article = container.querySelector("article");
    expect(article).not.toBeNull();
    expect(
      within(article as HTMLElement).getByRole("heading", { level: 3 }),
    ).toBeInTheDocument();
  });
});
