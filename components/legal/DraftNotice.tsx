import { Warning } from "@phosphor-icons/react/dist/ssr";

/**
 * DraftNotice: visible "this is a draft" callout for the legal pages
 * (Server Component, reused by /privacy and /terms; NOT used on /pricing).
 *
 * Reads clearly as a caution, not body text: a sober sunken-surface card
 * framed by the strong hairline border, with the warning icon in the system
 * caution ocre (`--color-warning`, ≥3:1 as a large glyph), a muted mono label
 * and ink body text. Token-only, radius from the system, base-flat (no shadow
 * per the clean v2 surface).
 *
 * a11y: `role="note"` with an explicit `aria-label` so assistive tech announces
 * it as an editorial note rather than reading it as part of the page prose.
 */
export function DraftNotice() {
  return (
    <aside
      role="note"
      aria-label="Aviso de borrador"
      className="flex items-start gap-3 rounded-md border border-border-strong bg-surface-sunken px-5 py-4 shadow-flat"
    >
      <Warning
        aria-hidden="true"
        weight="bold"
        className="mt-0.5 size-5 shrink-0 text-warning"
      />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-meta uppercase text-text-secondary">
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
