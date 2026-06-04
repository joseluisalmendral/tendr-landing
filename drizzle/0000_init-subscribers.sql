CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"ip_hash" text,
	"referrer" text,
	"confirmed_at" timestamp,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
