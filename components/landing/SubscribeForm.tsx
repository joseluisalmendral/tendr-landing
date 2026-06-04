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

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className="focus-ring h-auto rounded-md bg-accent-primary px-6 py-3 text-[length:var(--text-body)] text-accent-fg transition-[opacity,transform] duration-fast hover:opacity-90 active:translate-y-px disabled:opacity-50"
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
  );
}

export function SubscribeForm() {
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<SubscribeResult | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
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
    const response = await subscribe(formData);
    setResult(response);
    // Turnstile tokens are single-use: a fresh one is needed per attempt
    turnstileRef.current?.reset();
    setToken(null);
    if (response.ok) {
      reset();
    }
  }

  // Move focus to the live region when the submission fails
  useEffect(() => {
    if (result && !result.ok) {
      messageRef.current?.focus();
    }
  }, [result]);

  // Focus the email input when the user arrives at the waitlist anchor, so a CTA
  // click (same-page hash) or a cross-page navigation with #waitlist lands the
  // keyboard caret on the field they came to fill. preventScroll keeps us from
  // fighting the browser's / Lenis' own scroll-to-anchor (we focus WITHOUT
  // re-scrolling). We never steal focus on a plain page load with no #waitlist
  // hash. Edge case: clicking the SAME CTA twice when the hash is already
  // "#waitlist" fires no `hashchange` event, so focus is not re-applied on the
  // second click — acceptable, since the user is already at the form and the
  // browser keeps the caret where it was.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const focusIfWaitlist = () => {
      if (window.location.hash === "#waitlist") {
        emailRef.current?.focus({ preventScroll: true });
      }
    };

    // On mount: cross-page navigation that arrives with the hash already set.
    focusIfWaitlist();

    // Same-page CTA clicks change the hash → hashchange fires.
    window.addEventListener("hashchange", focusIfWaitlist);
    return () => window.removeEventListener("hashchange", focusIfWaitlist);
  }, []);

  const showEmailError = Boolean(errors.email && touchedFields.email);
  const message = result ? RESULT_MESSAGES[resultToMessageKey(result)] : null;

  return (
    <div className="flex flex-col gap-3">
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
              value="true"
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

          <SubmitButton disabled={!isValid || !token} />

          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            onError={() => setToken(null)}
          />
        </FormFields>
      </form>

      <div ref={messageRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {message ? (
          <p
            className={
              message.tone === "success"
                ? "rounded-sm bg-success-soft px-3 py-2 text-body-sm text-success"
                : message.tone === "danger"
                  ? "text-body-sm text-danger"
                  : "text-body-sm text-text-secondary"
            }
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
