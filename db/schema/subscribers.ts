import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  // sha256 of the request IP — enables rate limiting without storing raw IPs
  ipHash: text("ip_hash"),
  // Referrer URL the signup came from (nullable)
  referrer: text("referrer"),
  // Reserved for double opt-in (Resend confirmation flow). Unused in F7.
  confirmedAt: timestamp("confirmed_at"),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
