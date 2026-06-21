ALTER TABLE "facilities" ADD COLUMN "slug" text;--> statement-breakpoint
UPDATE "facilities" SET "slug" = trim(both '-' from lower(regexp_replace("code", '[^a-zA-Z0-9]+', '-', 'g'))) WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "facilities" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_slug_unique" UNIQUE("slug");
