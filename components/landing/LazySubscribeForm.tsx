"use client";

import { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";

/* PERF: SubscribeForm drags the heaviest client stack on the page (zod +
   react-hook-form + Turnstile ≈ 77KB, ~60KB unused at LCP per Lighthouse).
   A plain dynamic() import splits the chunk but Next still prefetches it
   during hydration, so the network cost lands inside the LCP window anyway.
   This wrapper defers the actual import until the form can matter:
     - the waitlist section approaches the viewport (IntersectionObserver,
       generous rootMargin so the form is ready before the user arrives), or
     - the user clicks any #waitlist CTA (load immediately, don't wait for
       the smooth scroll to bring the section near), or
     - the page loads with #waitlist already in the hash (direct arrival).
   SubscribeForm's own mount effect handles the focus-on-arrival behaviour,
   so by the time the chunk mounts the existing UX contract still holds. */
const SubscribeForm = dynamic(
  () =>
    import("@/components/landing/SubscribeForm").then((m) => m.SubscribeForm),
  { ssr: false, loading: () => <FormSkeleton /> },
);

/* Reserves the form's footprint so the placeholder→form swap never shifts
   layout (CLS budget is 0). The intro line is real SSR'd text; the blocks
   are aria-hidden decoration. */
function FormSkeleton() {
  return (
    <div className="flex min-h-[320px] flex-col gap-3">
      <p className="text-body-sm text-text-secondary">
        Te escribiremos solo para avisarte del lanzamiento de Tendr.
      </p>
      <div aria-hidden="true" className="flex flex-col gap-4">
        <div className="h-5 w-12 rounded-sm bg-border-hairline" />
        <div className="h-11 w-full rounded-sm bg-border-hairline" />
        <div className="h-10 w-full rounded-sm bg-border-hairline" />
        <div className="h-12 w-full rounded-md bg-border-hairline" />
      </div>
    </div>
  );
}

export function LazySubscribeForm() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;

    // Direct arrival: /#waitlist in the URL means the user came FOR the form.
    if (window.location.hash === "#waitlist") {
      setLoad(true);
      return;
    }

    // CTA intent: any click on an anchor targeting #waitlist starts the
    // import right away, racing the smooth scroll instead of trailing it.
    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      if ((anchor.getAttribute("href") ?? "").endsWith("#waitlist")) {
        setLoad(true);
      }
    };

    // Proximity: load while the section is still well below the fold.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setLoad(true);
      },
      { rootMargin: "800px 0px" },
    );

    document.addEventListener("click", onDocumentClick);
    if (hostRef.current) observer.observe(hostRef.current);

    return () => {
      document.removeEventListener("click", onDocumentClick);
      observer.disconnect();
    };
  }, [load]);

  return <div ref={hostRef}>{load ? <SubscribeForm /> : <FormSkeleton />}</div>;
}
