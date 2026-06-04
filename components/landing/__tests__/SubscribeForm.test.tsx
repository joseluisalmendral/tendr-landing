import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SubscribeResult } from "@/app/actions/subscribe";

// Mock the Server Action: the form calls subscribe(formData) and renders the
// composition off the returned result. We control the result per test.
const subscribeMock = vi.fn<(formData: FormData) => Promise<SubscribeResult>>();
vi.mock("@/app/actions/subscribe", () => ({
  subscribe: (formData: FormData) => subscribeMock(formData),
}));

// Mock Turnstile with a stub that immediately reports a token via onSuccess, so
// the submit button can become enabled without the real Cloudflare widget. The
// stubbed instance exposes reset() (the form calls turnstileRef.current.reset()).
vi.mock("@marsidev/react-turnstile", () => {
  const React = require("react");
  return {
    Turnstile: React.forwardRef(
      (
        { onSuccess }: { onSuccess: (token: string) => void },
        ref: React.Ref<{ reset: () => void }>,
      ) => {
        React.useImperativeHandle(ref, () => ({ reset: () => {} }));
        React.useEffect(() => {
          onSuccess("test-token");
        }, [onSuccess]);
        return React.createElement("div", { "data-testid": "turnstile-stub" });
      },
    ),
  };
});

// Import AFTER mocks are registered.
import { SubscribeForm } from "@/components/landing/SubscribeForm";

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email"), "freelancer@example.com");
  await user.click(screen.getByRole("checkbox"));
  // The Turnstile stub already supplied a token on mount, so the button enables.
  const submit = await screen.findByRole("button", { name: "Apuntarme" });
  await waitFor(() => expect(submit).toBeEnabled());
  await user.click(submit);
  return user;
}

describe("SubscribeForm success composition", () => {
  beforeEach(() => {
    subscribeMock.mockReset();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the celebratory success state on a new signup", async () => {
    subscribeMock.mockResolvedValue({ ok: true, duplicate: false, id: 1 });
    render(<SubscribeForm />);

    await fillAndSubmit();

    expect(await screen.findByText("Estás dentro.")).toBeInTheDocument();
    expect(
      screen.getByText("Te avisaremos cuando lancemos Tendr. ¡Gracias!"),
    ).toBeInTheDocument();
    // Form is swapped out: the submit button is gone.
    expect(
      screen.queryByRole("button", { name: "Apuntarme" }),
    ).not.toBeInTheDocument();
  });

  it("renders the calm neutral state when the email is a duplicate", async () => {
    subscribeMock.mockResolvedValue({ ok: true, duplicate: true });
    render(<SubscribeForm />);

    await fillAndSubmit();

    expect(await screen.findByText("Ya estabas en la lista.")).toBeInTheDocument();
    // Neutral tone never shows the celebratory heading.
    expect(screen.queryByText("Estás dentro.")).not.toBeInTheDocument();
  });

  it("returns to a working form when 'Apuntar otro email' is clicked", async () => {
    subscribeMock.mockResolvedValue({ ok: true, duplicate: false, id: 2 });
    render(<SubscribeForm />);

    const user = await fillAndSubmit();
    await screen.findByText("Estás dentro.");

    await user.click(screen.getByRole("button", { name: "Apuntar otro email" }));

    // The form is back (email field + submit button present) and the success
    // composition is gone.
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Apuntarme" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Estás dentro.")).not.toBeInTheDocument();
  });
});
