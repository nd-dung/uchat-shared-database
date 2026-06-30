CREATE TABLE "chatbot_embed_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"chatbot_id" integer NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"public_key" text NOT NULL,
	"allowed_origins" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chatbot_embed_settings_chatbot_id_unique" UNIQUE("chatbot_id"),
	CONSTRAINT "chatbot_embed_settings_public_key_unique" UNIQUE("public_key")
);
--> statement-breakpoint
ALTER TABLE "chatbot_embed_settings" ADD CONSTRAINT "chatbot_embed_settings_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chatbot_embed_settings_chatbot_id_idx" ON "chatbot_embed_settings" USING btree ("chatbot_id");--> statement-breakpoint
CREATE INDEX "chatbot_embed_settings_public_key_idx" ON "chatbot_embed_settings" USING btree ("public_key");