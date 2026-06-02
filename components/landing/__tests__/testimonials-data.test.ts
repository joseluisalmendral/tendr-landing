import { describe, expect, it } from "vitest";

import { TESTIMONIALS } from "@/components/landing/testimonials.data";
import type { EntranceVariant, NoteSize } from "@/components/landing/types";

const ENTRANCES: EntranceVariant[] = [
  "slide-up",
  "rotate-drop",
  "fade-scale",
  "slide-right",
  "blur-drop",
];
const SIZES: NoteSize[] = ["sm", "md", "lg"];

const EM_DASH = "—"; // —

describe("TESTIMONIALS dataset (cork storytelling, R8)", () => {
  it("contains exactly 7 testimonials", () => {
    expect(TESTIMONIALS).toHaveLength(7);
  });

  it("has no em-dash (U+2014) in any quote", () => {
    for (const t of TESTIMONIALS) {
      expect(t.quote).not.toContain(EM_DASH);
    }
  });

  it("every item has non-empty name, role and company", () => {
    for (const t of TESTIMONIALS) {
      expect(t.name.trim().length).toBeGreaterThan(0);
      expect(t.role.trim().length).toBeGreaterThan(0);
      expect(t.company.trim().length).toBeGreaterThan(0);
    }
  });

  it("marks exactly one featured note", () => {
    expect(TESTIMONIALS.filter((t) => t.featured)).toHaveLength(1);
  });

  it("has strictly increasing panPosition within 0..1", () => {
    let prev = -1;
    for (const t of TESTIMONIALS) {
      const p = t.panPosition ?? -1;
      expect(p).toBeGreaterThan(prev);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
      prev = p;
    }
  });

  it("uses only valid entrance variants and sizes", () => {
    for (const t of TESTIMONIALS) {
      expect(ENTRANCES).toContain(t.entrance);
      expect(SIZES).toContain(t.size);
    }
  });

  it("varies entrances across notes (not all identical)", () => {
    const unique = new Set(TESTIMONIALS.map((t) => t.entrance));
    expect(unique.size).toBeGreaterThan(1);
  });
});
