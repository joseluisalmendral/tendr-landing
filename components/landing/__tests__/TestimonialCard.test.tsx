import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { TestimonialCard } from "@/components/landing/TestimonialCard";
import type { TestimonialCardProps } from "@/components/landing/types";

// Realistic local Spanish attribution (no "John Doe").
const props: TestimonialCardProps = {
  name: "Lucía Mendoza",
  role: "Diseñadora freelance",
  company: "Estudio Cobalto",
  quote:
    "Tendr me ordenó la cartera de clientes en una tarde y dejé de perder seguimientos.",
  avatar: { src: "/avatars/lucia-mendoza.webp", width: 64, height: 64 },
};

describe("TestimonialCard", () => {
  it("renders exactly one figure, blockquote and figcaption", () => {
    const { container } = render(<TestimonialCard {...props} />);
    expect(container.querySelectorAll("figure")).toHaveLength(1);
    expect(container.querySelectorAll("blockquote")).toHaveLength(1);
    expect(container.querySelectorAll("figcaption")).toHaveLength(1);
  });

  it("renders the quote text inside the blockquote", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const blockquote = container.querySelector("blockquote");
    expect(blockquote?.textContent).toContain(props.quote);
  });

  it("wraps the quote in typographic quotes (no straight ASCII quotes)", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const blockquote = container.querySelector("blockquote");
    expect(blockquote?.textContent).toContain("«");
    expect(blockquote?.textContent).toContain("»");
    expect(blockquote?.textContent).not.toContain('"');
  });

  it("renders attribution with name, role and company in the figcaption", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const figcaption = container.querySelector("figcaption");
    expect(figcaption?.textContent).toContain(props.name);
    expect(figcaption?.textContent).toContain(props.role);
    expect(figcaption?.textContent).toContain(props.company);
  });

  it("sets the avatar alt to the exact derived contract string", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const img = container.querySelector("img");
    // Avatars are generated illustrations (dicebear), not photos -> "Avatar de".
    expect(img?.getAttribute("alt")).toBe(
      `Avatar de ${props.name}, ${props.role} en ${props.company}`,
    );
  });

  it("reserves avatar dimensions for CLS (explicit width/height attrs)", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("width")).toBe(String(props.avatar.width));
    expect(img?.getAttribute("height")).toBe(String(props.avatar.height));
  });

  it("wraps the avatar in an overflow-hidden container (no edge bleed)", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const wrapper = container.querySelector(".tw-note__avatar");
    // The bleed fix: the avatar lives inside an opaque, clipped wrapper.
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("overflow-hidden");
    expect(wrapper?.querySelector("img")).not.toBeNull();
  });

  it("keeps the cream surface on the figure, not the article (desync fix)", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const article = container.querySelector("article.tw-note");
    const figure = container.querySelector("figure");
    // The opaque paper surface moves WITH the unit: bg lives on the figure.
    expect(figure?.className).toContain("bg-surface-raised");
    // The article must NOT carry the surface bg (root cause of the cream bleed).
    expect(article?.className).not.toContain("bg-surface-raised");
  });

  it("keeps the pushpin at the article level (anchored to the cork)", () => {
    const { container } = render(<TestimonialCard {...props} />);
    const article = container.querySelector("article.tw-note");
    const pin = article?.querySelector(":scope > .tw-note__pin");
    // The pin stays on the cork so the paper swings under it.
    expect(pin).not.toBeNull();
  });

  it("contains no em-dash anywhere in the rendered output", () => {
    const { container } = render(<TestimonialCard {...props} />);
    expect(container.textContent).not.toContain("—");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestimonialCard {...props} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
