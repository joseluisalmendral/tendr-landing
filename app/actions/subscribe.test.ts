// @vitest-environment node
/**
 * Unit tests for the subscribe Server Action.
 *
 * The DB module is mocked IN-FILE (not in vitest.setup.ts) on purpose:
 * - vi.mock is hoisted per test file, so the real "@/db" never loads here
 *   (its module-level DATABASE_URL guard would throw in tests).
 * - A global mock in the setup file would leak into the 66 component tests
 *   that never touch the database.
 *
 * Tests run in node (not jsdom): this is pure server logic, no DOM.
 */
import { createHash } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { subscribe } from "./subscribe";
import { db } from "@/db";

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

const TEST_IP = "203.0.113.7";
const TEST_REFERRER = "https://tendr.example/pricing";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () =>
    new Headers({
      // First hop is the client IP; the action must take it, not the proxy's
      "x-forwarded-for": `${TEST_IP}, 10.0.0.1`,
      referer: TEST_REFERRER,
    }),
  ),
}));

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TEST_SECRET = "test-turnstile-secret";
const TEST_SALT = "test-salt";

function buildFormData(
  fields: Partial<Record<"email" | "consent" | "turnstileToken", string>>,
): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.set(key, value);
  }
  return formData;
}

function mockTurnstile(success: boolean) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ json: async () => ({ success }) });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** Rate-limit count query: db.select({...}).from(...).where(...) -> [{ value }] */
function mockRecentCount(value: number) {
  vi.mocked(db.select).mockReturnValue({
    from: () => ({ where: () => Promise.resolve([{ value }]) }),
  } as never);
}

/** Insert chain: db.insert(...).values(...).onConflictDoNothing(...).returning(...) */
function mockInsertReturning(rows: Array<{ id: number }>) {
  const valuesSpy = vi.fn((_payload: Record<string, string | null>) => ({
    onConflictDoNothing: () => ({ returning: () => Promise.resolve(rows) }),
  }));
  vi.mocked(db.insert).mockReturnValue({ values: valuesSpy } as never);
  return valuesSpy;
}

describe("subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("TURNSTILE_SECRET_KEY", TEST_SECRET);
    vi.stubEnv("SUBSCRIBE_SALT", TEST_SALT);
    mockRecentCount(0);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("inserts a new email and returns its id", async () => {
    const fetchMock = mockTurnstile(true);
    const valuesSpy = mockInsertReturning([{ id: 1 }]);

    const result = await subscribe(
      buildFormData({
        email: "  USER@Example.COM  ",
        consent: "true",
        turnstileToken: "tok-123",
      }),
    );

    expect(result).toEqual({ ok: true, duplicate: false, id: 1 });

    // Turnstile verified server-side with the real secret + token contract
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(SITEVERIFY_URL);
    const body = init.body as URLSearchParams;
    expect(body.get("secret")).toBe(TEST_SECRET);
    expect(body.get("response")).toBe("tok-123");

    // Insert payload contract: normalized email, salted ip hash, referrer
    expect(valuesSpy).toHaveBeenCalledTimes(1);
    const payload = valuesSpy.mock.calls[0][0];
    expect(payload.email).toBe("user@example.com");
    expect(payload.referrer).toBe(TEST_REFERRER);
    expect(payload.ipHash).toBe(
      createHash("sha256").update(TEST_IP + TEST_SALT).digest("hex"),
    );
  });

  it("reports duplicate when the unique constraint swallows the insert", async () => {
    mockTurnstile(true);
    mockInsertReturning([]);

    const result = await subscribe(
      buildFormData({
        email: "user@example.com",
        consent: "true",
        turnstileToken: "tok-123",
      }),
    );

    expect(result).toEqual({ ok: true, duplicate: true });
  });

  it("rejects when Turnstile verification fails, without touching the db", async () => {
    mockTurnstile(false);

    const result = await subscribe(
      buildFormData({
        email: "user@example.com",
        consent: "true",
        turnstileToken: "tok-bad",
      }),
    );

    expect(result).toEqual({ ok: false, error: "turnstile_failed" });
    expect(db.insert).not.toHaveBeenCalled();
    // Rate-limit query runs AFTER Turnstile by design — must not fire either
    expect(db.select).not.toHaveBeenCalled();
  });

  it("rejects a malformed email before calling Turnstile", async () => {
    const fetchMock = mockTurnstile(true);

    const result = await subscribe(
      buildFormData({
        email: "not-an-email",
        consent: "true",
        turnstileToken: "tok-123",
      }),
    );

    expect(result).toEqual({ ok: false, error: "invalid_input" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });

  it.each([
    ["missing", undefined],
    ["not the literal 'true'", "false"],
  ])(
    "requires consent server-side (%s): no Turnstile call, no db",
    async (_label, consent) => {
      const fetchMock = mockTurnstile(true);

      const result = await subscribe(
        buildFormData({
          email: "user@example.com",
          consent,
          turnstileToken: "tok-123",
        }),
      );

      expect(result).toEqual({ ok: false, error: "consent_required" });
      expect(fetchMock).not.toHaveBeenCalled();
      expect(db.insert).not.toHaveBeenCalled();
      expect(db.select).not.toHaveBeenCalled();
    },
  );

  it("blocks the 6th signup from the same hashed ip within the window", async () => {
    mockTurnstile(true);
    mockRecentCount(5);

    const result = await subscribe(
      buildFormData({
        email: "user@example.com",
        consent: "true",
        turnstileToken: "tok-123",
      }),
    );

    expect(result).toEqual({ ok: false, error: "rate_limited" });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("maps unexpected db failures to server_error and logs server-side", async () => {
    mockTurnstile(true);
    vi.mocked(db.insert).mockImplementation(() => {
      throw new Error("connection reset");
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await subscribe(
      buildFormData({
        email: "user@example.com",
        consent: "true",
        turnstileToken: "tok-123",
      }),
    );

    // The client gets a typed error, never the exception/stack
    expect(result).toEqual({ ok: false, error: "server_error" });
    expect(errorSpy).toHaveBeenCalledWith(
      "subscribe: unexpected error",
      expect.any(Error),
    );

    errorSpy.mockRestore();
  });

  it("fails closed with server_error when secrets are not configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const fetchMock = mockTurnstile(true);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await subscribe(
      buildFormData({
        email: "user@example.com",
        consent: "true",
        turnstileToken: "tok-123",
      }),
    );

    expect(result).toEqual({ ok: false, error: "server_error" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
