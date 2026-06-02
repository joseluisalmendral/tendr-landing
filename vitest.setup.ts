import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// jest-axe matcher: enables `expect(...).toHaveNoViolations()` in component a11y tests.
expect.extend(toHaveNoViolations);

// jsdom has no IntersectionObserver, which Motion's `whileInView` (used by the
// time-based testimonial entrance) requires at render time. Provide a no-op mock
// so components that use whileInView render in tests (the entrance itself is not
// under unit test; behaviour like keyboard focus is).
if (!("IntersectionObserver" in globalThis)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

// Mock next/image to a plain <img> so jsdom exposes real src/alt/width/height for
// assertions. Strip non-DOM props (preload/priority/fill/placeholder/blurDataURL/sizes)
// that React would otherwise warn about or that are not valid <img> attributes.
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const {
      preload: _preload,
      priority: _priority,
      fill: _fill,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      loader: _loader,
      quality: _quality,
      ...rest
    } = props;
    return createElement("img", rest);
  },
}));

// Mock next/link to a plain <a href> so href/accessible-name assertions work.
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) =>
    createElement("a", { href, ...rest }, children),
}));
