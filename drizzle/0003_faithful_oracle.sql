CREATE TYPE "public"."chat_window_position" AS ENUM('bottom_right', 'bottom_left');--> statement-breakpoint
CREATE TYPE "public"."chatbot_status" AS ENUM('active', 'inactive', 'draft');--> statement-breakpoint
CREATE TABLE "chatbot_ui_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"chatbot_id" integer NOT NULL,
	"primary_color" text DEFAULT '#2563EB',
	"background_color" text DEFAULT '#FFFFFF',
	"header_background_color" text DEFAULT '#2563EB',
	"header_text_color" text DEFAULT '#FFFFFF',
	"bot_message_background_color" text DEFAULT '#F3F4F6',
	"bot_message_text_color" text DEFAULT '#111827',
	"user_message_background_color" text DEFAULT '#2563EB',
	"user_message_text_color" text DEFAULT '#FFFFFF',
	"avatar_url" text,
	"logo_url" text,
	"launcher_icon_url" text,
	"header_title" text,
	"header_subtitle" text,
	"welcome_message" text DEFAULT 'Xin chào! Tôi có thể hỗ trợ gì cho bạn?',
	"placeholder_text" text DEFAULT 'Nhập câu hỏi của bạn...',
	"chat_window_position" "chat_window_position" DEFAULT 'bottom_right' NOT NULL,
	"chat_window_width" integer DEFAULT 380,
	"chat_window_height" integer DEFAULT 600,
	"border_radius" integer DEFAULT 16,
	"message_bubble_radius" integer DEFAULT 12,
	"show_avatar" boolean DEFAULT true NOT NULL,
	"show_logo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "chatbot_ui_settings_chatbot_id_unique" UNIQUE("chatbot_id")
);
--> statement-breakpoint
CREATE TABLE "chatbots" (
	"id" serial PRIMARY KEY NOT NULL,
	"facility_id" integer NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"description" text,
	"status" "chatbot_status" DEFAULT 'draft' NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "chatbots_facility_id_unique" UNIQUE("facility_id")
);
--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD CONSTRAINT "chatbot_ui_settings_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbots" ADD CONSTRAINT "chatbots_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbots" ADD CONSTRAINT "chatbots_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbots" ADD CONSTRAINT "chatbots_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chatbots_status_idx" ON "chatbots" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chatbots_deleted_at_idx" ON "chatbots" USING btree ("deleted_at");