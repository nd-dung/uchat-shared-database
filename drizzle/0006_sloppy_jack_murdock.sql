CREATE TYPE "public"."knowledge_category_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."knowledge_document_source_type" AS ENUM('manual', 'file', 'url', 'faq');--> statement-breakpoint
CREATE TYPE "public"."knowledge_document_status" AS ENUM('draft', 'active', 'inactive');--> statement-breakpoint
CREATE TABLE "knowledge_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"facility_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "knowledge_category_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "knowledge_categories_facility_id_name_unique" UNIQUE("facility_id","name")
);
--> statement-breakpoint
CREATE TABLE "knowledge_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"facility_id" integer NOT NULL,
	"category_id" integer,
	"title" text NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"source_type" "knowledge_document_source_type" DEFAULT 'manual' NOT NULL,
	"source_url" text,
	"status" "knowledge_document_status" DEFAULT 'draft' NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD CONSTRAINT "knowledge_categories_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD CONSTRAINT "knowledge_categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD CONSTRAINT "knowledge_categories_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_documents" ADD CONSTRAINT "knowledge_documents_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_documents" ADD CONSTRAINT "knowledge_documents_category_id_knowledge_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."knowledge_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_documents" ADD CONSTRAINT "knowledge_documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_documents" ADD CONSTRAINT "knowledge_documents_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "knowledge_categories_facility_id_idx" ON "knowledge_categories" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "knowledge_categories_status_idx" ON "knowledge_categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "knowledge_categories_deleted_at_idx" ON "knowledge_categories" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "knowledge_documents_facility_id_idx" ON "knowledge_documents" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "knowledge_documents_category_id_idx" ON "knowledge_documents" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "knowledge_documents_status_idx" ON "knowledge_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "knowledge_documents_source_type_idx" ON "knowledge_documents" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "knowledge_documents_deleted_at_idx" ON "knowledge_documents" USING btree ("deleted_at");