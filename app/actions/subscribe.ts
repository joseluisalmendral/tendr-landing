"use server";

import { createHash } from "node:crypto";

import { and, count, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { subscribers } from "@/db/schema/subscribers";

const subscribeSchema = z.object({
  // Normalize before validating so " A@B.com " passes and stores as "a@b.com".
  // 254 chars is the RFC 5321 practical limit for an address.
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  // The consent checkbox arrives as the string 'true' in FormData
  consent: z.literal("true"),
  turnstileToken: z.string().min(1),
});

export type SubscribeResult =
  | { ok: true; duplicate: true }
  | { ok: true; duplicate: false; id: number }
  | {
      ok: false;
      error:
        | "consent_required"
        | "turnstile_failed"
        | "invalid_input"
        | "rate_limited"
        | "server_error";
    };

// Max signups allowed per hashed IP within the sliding window
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function subscribe(formData: FormData): Promise<SubscribeResult> {
  try {
    // Consent is enforced server-side too — checked first, before touching
    // Turnstile or the database.
    if (formData.get("consent") !== "true") {
      return { ok: false, error: "consent_required" };
    }

    const parsed = subscribeSchema.safeParse({
      email: formData.get("email"),
      consent: formData.get("consent"),
      turnstileToken: formData.get("turnstileToken"),
    });

    if (!parsed.success) {
      return { ok: false, error: "invalid_input" };
    }

    const { email, turnstileToken } = parsed.data;

    if (!process.env.TURNSTILE_SECRET_KEY || !process.env.SUBSCRIBE_SALT) {
      console.error("subscribe: missing TURNSTILE_SECRET_KEY or SUBSCRIBE_SALT env var");
      return { ok: false, error: "server_error" };
    }

    // Server-side Turnstile verification — the client widget alone proves nothing
    const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const verification: { success?: boolean } = await verifyResponse.json();

    if (verification.success !== true) {
      return { ok: false, error: "turnstile_failed" };
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    // sha256(ip + salt) — rate limiting signal without storing raw IPs
    const ipHash = createHash("sha256")
      .update(ip + process.env.SUBSCRIBE_SALT)
      .digest("hex");

    const referrer = headersList.get("referer");

    // Rate limiting: cap signups per hashed IP in the last hour. Runs after
    // Turnstile so bots can't use this query as a free amplification vector.
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const [recent] = await db
      .select({ value: count() })
      .from(subscribers)
      .where(
        and(
          eq(subscribers.ipHash, ipHash),
          gt(subscribers.createdAt, windowStart),
        ),
      );

    if (recent.value >= RATE_LIMIT_MAX) {
      return { ok: false, error: "rate_limited" };
    }

    const inserted = await db
      .insert(subscribers)
      .values({ email, ipHash, referrer })
      .onConflictDoNothing({ target: subscribers.email })
      .returning({ id: subscribers.id });

    if (inserted.length === 0) {
      return { ok: true, duplicate: true };
    }

    return { ok: true, duplicate: false, id: inserted[0].id };
  } catch (error) {
    console.error("subscribe: unexpected error", error);
    return { ok: false, error: "server_error" };
  }
}
