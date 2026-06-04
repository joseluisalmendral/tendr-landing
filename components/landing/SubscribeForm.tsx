"use client";

import { useEffect, useRef, useState } from "react";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { subscribe, type SubscribeResult } from "@/app/actions/subscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  consent: z.boolean().refine((value) => value === true),
});

type FormValues = z.infer<typeof formSchema>;

const RESULT_MESSAGES: Record<string, { text: string; tone: "success" | "neutral" | "danger" }> = {
  new: {
    text: "Te avisaremos cuando lancemos. ¡Gracias!",
    tone: "success",
  },
  duplicate: {
    text: "Ya estás en la lista, te avisaremos.",
    tone: "neutral",
  },
  turnstile_failed: {
    text: "No pudimos verificar que no eres un bot. Recarga e inténtalo de nuevo.",
    tone: "danger",
  },
  invalid_input: {
    text: "Email no válido.",
    tone: "danger",
  },
  consent_required: {
    text: "Necesitamos tu consentimiento para guardar el email.",
    tone: "danger",
  },
  rate_limited: {
    text: "Demasiados intentos desde esta conexión. Inténtalo de nuevo en una hora.",
    tone: "danger",
  },
  server_error: {
    text: "Algo falló. Inténtalo de nuevo en unos minutos.",
    tone: "danger",
  },
};

function resultToMessageKey(result: SubscribeResult): string {
  if (result.ok) {
    return result.duplicate ? "duplicate" : "new";
  }
  return result.error;
}

/* Copy for the two ok composition states. The visual celebration is the brand's
   hand-drawn voice; this is the text it frames (and the text screen readers hear,
   since the artwork is aria-hidden). */
const SUCCESS_COPY = {
  success: {
    heading: "Estás dentro.",
    body: "Te avisaremos cuando lancemos Tendr. ¡Gracias!",
  },
  neutral: {
    heading: "Ya estabas en la lista.",
    body: "Tranqui: te avisaremos cuando lancemos Tendr.",
  },
} as const;

type SuccessTone = keyof typeof SUCCESS_COPY;

/* The conversion-moment composition that replaces the form on a successful
   submit. The artwork (hand-drawn check + brand wisp) is aria-hidden decoration;
   the heading carries the announcement and receives focus after the swap, so
   keyboard + screen-reader users land on (and hear) the result. Motion is
   CSS-only off data-tone (globals.css "WAITLIST SUCCESS" block); reduced-motion
   users get the same content, instant. */
function SuccessState({
  tone,
  headingRef,
  onReset,
}: {
  tone: SuccessTone;
  headingRef: React.Ref<HTMLParagraphElement>;
  onReset: () => void;
}) {
  const copy = SUCCESS_COPY[tone];

  return (
    <div
      className="waitlist-success flex flex-col items-center gap-4 py-2 text-center"
      data-tone={tone}
    >
      {/* Hand-drawn mark. Success → a check that draws itself in --color-success
          (REGLA DURA: success green, never teal). Neutral → no green, no draw:
          a calm support-hue underline tick so the card never feels empty. Both
          use the one-pen round-cap grammar of the board doodles. aria-hidden. */}
      <svg
        aria-hidden="true"
        className={
          tone === "success"
            ? "waitlist-success__check h-9 w-9 text-success"
            : "waitlist-success__check h-8 w-8 text-handdrawn"
        }
        viewBox="0 0 32 32"
        fill="none"
      >
        {tone === "success" ? (
          <path
            d="M7 17.5C9.5 20 11 22 13 25c3.5-8 7-12.5 12-18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
        ) : (
          <path
            d="M6 18c5-1.5 14-1.5 20 0"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
          />
        )}
      </svg>

      {/* The heading is the live announcement target: tabIndex -1 so focus can
          land here after the swap, and it sits inside an aria-live region below
          via the mirrored text — see the form's message region. */}
      <div className="flex flex-col items-center gap-1.5">
        <p
          ref={headingRef}
          tabIndex={-1}
          className={
            tone === "success"
              ? "waitlist-success__heading relative font-heading text-h3 text-success focus:outline-none"
              : "waitlist-success__heading relative font-heading text-h3 text-text-primary focus:outline-none"
          }
        >
          {copy.heading}
          {/* Brand firma wisp under the headline — success tone only, drawn in
              --color-handdrawn (the firma hue). Neutral stays quiet. */}
          {tone === "success" ? (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-1.5 h-1.5 w-full text-handdrawn"
              viewBox="0 0 120 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                className="waitlist-success__wisp"
                d="M3 5C26 2 52 1 78 3c14 1 28 2 39 1"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                pathLength={1}
              />
            </svg>
          ) : null}
        </p>
        <p className="waitlist-success__copy text-body-sm text-text-secondary">
          {copy.body}
        </p>
      </div>

      {/* Quiet way back to the form. Returning unmounts this composition and
          remounts the form (and a FRESH Turnstile widget → new single-use token),
          so the form is fully re-armed. */}
      <button
        type="button"
        onClick={onReset}
        className="focus-ring text-body-sm text-text-secondary underline underline-offset-2 transition-opacity duration-fast hover:opacity-80"
      >
        Apuntar otro email
      </button>
    </div>
  );
}

/* Child of <form action>: useFormStatus only reports pending for
   action-prop submissions, and only from inside the form tree. */
function FormFields({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <fieldset
      disabled={pending}
      aria-busy={pending}
      className="flex flex-col gap-4 border-0 p-0"
    >
      {children}
    </fieldset>
  );
}

function SubmitButton({
  disabled,
  describedBy,
}: {
  disabled: boolean;
  describedBy?: string;
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  // Visual-only "wake-up" state. The form logic above is untouched; this only
  // drives the hand-drawn wisp + scale-pop celebration in globals.css via
  // data-attributes on the wrapper.
  const [ready, setReady] = useState(!isDisabled);
  const [justEnabled, setJustEnabled] = useState(false);
  // Previous disabled value, so we fire the beat ONLY on the false→true
  // transition of "becomes clickable" (i.e. isDisabled true→false). Seeded to
  // `true` because the form mounts disabled (empty email): this guarantees the
  // beat never fires on initial mount.
  const prevDisabledRef = useRef(true);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wasDisabled = prevDisabledRef.current;
    prevDisabledRef.current = isDisabled;
    setReady(!isDisabled);

    // Celebrate only on the becomes-clickable edge (disabled → enabled).
    if (wasDisabled && !isDisabled) {
      // Replay guard / debounce: if a previous beat is still mid-flight (rapid
      // check/uncheck toggling), clear it so we never stack or strobe. Setting
      // justEnabled false then true on the next frame forces a clean restart of
      // the CSS animation.
      if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
      setJustEnabled(false);
      const raf = requestAnimationFrame(() => setJustEnabled(true));
      // Clear the one-shot flag after the longest sub-animation (the ~600ms
      // wisp draw-in) so the beat does not replay while the state stays enabled.
      replayTimerRef.current = setTimeout(() => setJustEnabled(false), 650);
      return () => cancelAnimationFrame(raf);
    }

    // Going back to disabled (or any non-edge change): no celebration, just the
    // quiet settle handled by CSS. Make sure no stale beat lingers.
    if (!wasDisabled && isDisabled) {
      if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
      setJustEnabled(false);
    }
  }, [isDisabled]);

  useEffect(
    () => () => {
      if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
    },
    [],
  );

  return (
    // Wrapper carries the state the wisp draws from; the wisp sits BEHIND the
    // button (sibling, z-behind) so it reads as drawn under the label.
    <span
      className="waitlist-submit relative inline-flex w-full"
      data-ready={ready ? "true" : "false"}
      data-just-enabled={justEnabled ? "true" : "false"}
    >
      <Button
        type="submit"
        disabled={isDisabled}
        aria-describedby={describedBy}
        // disabled:pointer-events-auto re-enables hover ONLY so the
        // cursor-not-allowed feedback can show (the base Button kills pointer
        // events when disabled); hover/active effects stay gated to enabled.
        // The "ready"/wake-up grammar is visual-only and additive: enabled state
        // also bumps the label to font-medium so the change is not color-only.
        className="waitlist-submit__btn focus-ring relative z-10 h-auto w-full rounded-md bg-accent-primary px-6 py-3 text-[length:var(--text-body)] text-accent-fg transition-[opacity,transform] duration-fast enabled:font-medium enabled:hover:opacity-90 enabled:active:translate-y-px disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-4 motion-safe:animate-spin"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="4"
            />
            <path
              d="M22 12a10 10 0 0 0-10-10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          Apuntándote...
        </>
      ) : (
        "Apuntarme"
      )}
      </Button>

      {/* The brand firma: a single hand-drawn wisp (--color-handdrawn) that
          draws itself under the button on the wake-up beat (design §3/§4). Sits
          BEHIND the button (z-0) along its bottom edge, aria-hidden decoration.
          Same canonical stroke shape as the Footer wordmark wisp. The draw-in /
          settle is driven entirely by CSS off the wrapper's data-attributes. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 -bottom-2 z-0 h-2 w-[calc(100%-1.5rem)] text-handdrawn"
        viewBox="0 0 120 12"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          className="waitlist-wisp"
          d="M3 8C26 4 52 3 78 5c14 1 28 2 39 1"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
        />
      </svg>
    </span>
  );
}

export function SubscribeForm() {
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<SubscribeResult | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  // Heading of the success/duplicate composition — focus moves here after the
  // swap so keyboard + screen-reader users land on (and hear) the result.
  const successHeadingRef = useRef<HTMLParagraphElement | null>(null);
  // Local ref to the email input so we can move keyboard focus to it when the
  // user arrives at #waitlist (merged with react-hook-form's own ref below).
  const emailRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    watch,
    reset,
    formState: { errors, touchedFields, isValid },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    mode: "onChange",
    defaultValues: { email: "", consent: false },
  });

  const emailField = register("email");
  const consentField = register("consent");
  const consentChecked = watch("consent");

  async function handleAction(formData: FormData) {
    // The checkbox carries no value attribute (RHF would store the string
    // "true" instead of a boolean, breaking the zod boolean schema). Native
    // FormData therefore submits "on" when checked — normalize it here to the
    // server contract, which requires the literal "true".
    formData.set("consent", consentChecked ? "true" : "");
    const response = await subscribe(formData);
    setResult(response);
    // Turnstile tokens are single-use: a fresh one is needed per attempt
    turnstileRef.current?.reset();
    setToken(null);
    if (response.ok) {
      reset();
    }
  }

  // Move focus to the live region when the submission fails, or to the success
  // heading when it succeeds — focus must never be lost to <body> after a swap.
  useEffect(() => {
    if (!result) return;
    if (result.ok) {
      successHeadingRef.current?.focus();
    } else {
      messageRef.current?.focus();
    }
  }, [result]);

  // Quiet "back to the form" path. handleAction already reset() the form and
  // reset the Turnstile widget on success; clearing the result unmounts the
  // success composition and remounts the form — including a FRESH <Turnstile>,
  // which mints a new single-use token. The button stays disabled until that
  // token (and a valid email + consent) arrive, so the re-armed form is correct.
  function handleBackToForm() {
    setResult(null);
  }

  // Focus the email input when the user arrives at the waitlist anchor, so a CTA
  // click or a cross-page navigation with #waitlist lands the keyboard caret on
  // the field they came to fill. preventScroll keeps us from fighting the
  // browser's / Lenis' own scroll-to-anchor (we focus WITHOUT re-scrolling). We
  // never steal focus on a plain page load with no #waitlist hash.
  //
  // IMPORTANT: next/link navigates via history.pushState, which does NOT fire
  // `hashchange` (verified with Playwright: hash updates, event never fires).
  // So we listen for CLICKS on any anchor targeting #waitlist instead — this
  // also covers repeated clicks on the same CTA (no hash change at all). The
  // hashchange listener stays as a cheap fallback for native hash navigation.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const focusEmail = () => {
      emailRef.current?.focus({ preventScroll: true });
    };

    const focusIfWaitlistHash = () => {
      if (window.location.hash === "#waitlist") focusEmail();
    };

    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.endsWith("#waitlist")) return;
      // Let the router/browser process the navigation + scroll first, then
      // place the caret without re-scrolling.
      requestAnimationFrame(() => requestAnimationFrame(focusEmail));
    };

    // On mount: cross-page arrival (hard load or route change) with the hash set.
    focusIfWaitlistHash();

    document.addEventListener("click", onDocumentClick);
    window.addEventListener("hashchange", focusIfWaitlistHash);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      window.removeEventListener("hashchange", focusIfWaitlistHash);
    };
  }, []);

  const showEmailError = Boolean(errors.email && touchedFields.email);
  const message = result ? RESULT_MESSAGES[resultToMessageKey(result)] : null;
  // On a successful submit we swap the whole form for the celebratory
  // composition. duplicate → calm/neutral tone; new signup → success tone.
  const successTone: SuccessTone | null = result?.ok
    ? result.duplicate
      ? "neutral"
      : "success"
    : null;

  // First unmet requirement, in form order — tells the user exactly what to
  // do next to enable the button. Not aria-live on purpose: it updates on
  // every keystroke and would be noisy for screen readers; it is linked to
  // the button via aria-describedby instead.
  const emailReady = watch("email") !== "" && !errors.email;
  const submitHint = !emailReady
    ? "Escribe tu email para activar el botón."
    : !consentChecked
      ? "Marca la casilla de consentimiento para activar el botón."
      : !token
        ? "Un momento: comprobando que no eres un bot..."
        : null;

  return (
    <div className="flex flex-col gap-3">
      {successTone ? (
        <SuccessState
          tone={successTone}
          headingRef={successHeadingRef}
          onReset={handleBackToForm}
        />
      ) : (
        <>
      <p className="text-body-sm text-text-secondary">
        Te escribiremos solo para avisarte del lanzamiento de Tendr.
      </p>

      <form
        action={handleAction}
        onSubmit={(event) => {
          // Defense for Enter-key submits: never fire the action while invalid
          if (!isValid || !token) {
            event.preventDefault();
          }
        }}
        noValidate
      >
        <FormFields>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="subscribe-email" className="text-body-sm font-medium text-text-primary">
              Email
            </label>
            <Input
              {...emailField}
              ref={(el) => {
                // Keep react-hook-form's ref working AND expose the node to our
                // own emailRef so the arrival-focus effect can target it.
                emailField.ref(el);
                emailRef.current = el;
              }}
              id="subscribe-email"
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder="tu@email.com"
              value={watch("email")}
              aria-invalid={showEmailError}
              aria-describedby={showEmailError ? "subscribe-email-error" : undefined}
              className="h-auto rounded-sm border-border-strong px-3 py-2.5 text-[length:var(--text-body)]"
            />
            {showEmailError ? (
              <p id="subscribe-email-error" className="text-body-sm text-danger">
                Email no válido.
              </p>
            ) : null}
          </div>

          <div className="flex items-start gap-2.5">
            <input
              {...consentField}
              id="subscribe-consent"
              type="checkbox"
              checked={consentChecked}
              className="focus-ring mt-0.5 size-4 shrink-0 rounded-sm border border-border-strong accent-[var(--color-accent-primary)]"
            />
            <label htmlFor="subscribe-consent" className="text-body-sm text-text-secondary">
              Acepto que Tendr guarde mi email para avisarme del lanzamiento.{" "}
              <Link href="/privacy" className="focus-ring underline underline-offset-2">
                política de privacidad
              </Link>
            </label>
          </div>

          <input type="hidden" name="turnstileToken" value={token ?? ""} />

          <div className="flex flex-col gap-1.5">
            <SubmitButton
              disabled={!isValid || !token}
              describedBy={submitHint ? "subscribe-submit-hint" : undefined}
            />
            {submitHint ? (
              <p
                id="subscribe-submit-hint"
                className="text-body-sm text-text-secondary"
              >
                {submitHint}
              </p>
            ) : null}
          </div>

          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            onError={() => setToken(null)}
          />
        </FormFields>
      </form>
        </>
      )}

      {/* Single aria-live region for both paths. On the ok composition the
          visible artwork carries the message, so here we announce the same text
          visually-hidden (no duplicate green box). On error it shows the visible
          danger text inline and receives focus, exactly as before. */}
      <div
        ref={messageRef}
        tabIndex={-1}
        aria-live="polite"
        className="focus:outline-none"
      >
        {message ? (
          successTone ? (
            <p className="sr-only">{message.text}</p>
          ) : (
            <p
              className={
                message.tone === "danger"
                  ? "text-body-sm text-danger"
                  : "text-body-sm text-text-secondary"
              }
            >
              {message.text}
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}
