"use client";

import { useEffect } from "react";

/**
 * Dev-only accessibility reporter.
 *
 * Dynamically loads @axe-core/react and runs axe-core against the live React
 * tree, logging any violations to the browser console (debounced 1000ms, so it
 * re-checks after renders and route changes). Mounted once in the root layout,
 * it therefore reports on every page during development.
 *
 * The whole thing is gated behind `NODE_ENV !== 'production'`: the dynamic
 * import never executes in production, so axe-core is not loaded for real
 * users. Renders nothing.
 */
export function AxeReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    let cancelled = false;
    void Promise.all([
      import("react"),
      import("react-dom"),
      import("@axe-core/react"),
    ]).then(([React, ReactDOM, axe]) => {
      if (cancelled) return;
      // @axe-core/react@4.11.3 default export: axe(React, ReactDOM, timeout).
      // `.default ?? mod` covers both ESM and CJS interop of the namespaces.
      void axe.default(
        React.default ?? React,
        ReactDOM.default ?? ReactDOM,
        1000,
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
