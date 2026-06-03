import { Warning } from "@phosphor-icons/react/dist/ssr";

/**
 * DraftNotice: visible "this is a draft" callout for the legal pages
 * (Server Component, reused by /privacy and /terms; NOT used on /pricing).
 *
 * Reads clearly as a warning, not body text: clay annotation surface
 * (accent-secondary-soft) framed by the strong ink border with a hard shadow,
 * a small mono label and a warning icon. Token-only, radius from the system.
 *
 * a11y: `role="note"` with an explicit `aria-label` so assistive tech announces
 * it as an editorial note rather than reading it as part of the page prose.
 */
export function DraftNotice() {
  return (
    <aside
      role="note"
      aria-label="Aviso de borrador"
      className="flex items-start gap-3 rounded-md border border-border-strong bg-accent-secondary-soft px-5 py-4 shadow-flat"
    >
      <Warning
        aria-hidden="true"
        weight="bold"
        className="mt-0.5 size-5 shrink-0 text-accent-secondary"
      />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-meta uppercase text-accent-secondary">
          Borrador
        </span>
        <p className="text-body-sm text-text-primary">
          Borrador redactado por el agente. Requiere revisión humana o legal
          antes de publicar en producción.
        </p>
      </div>
    </aside>
  );
}
