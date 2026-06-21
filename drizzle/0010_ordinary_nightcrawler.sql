CREATE TYPE "public"."chatbot_response_style" AS ENUM('short_answer', 'detailed_answer', 'step_by_step', 'faq_style');--> statement-breakpoint
CREATE TYPE "public"."chatbot_response_tone" AS ENUM('friendly', 'professional', 'formal', 'concise');--> statement-breakpoint
CREATE TABLE "chatbot_behavior_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"chatbot_id" integer NOT NULL,
	"system_prompt" text,
	"support_scope" text,
	"response_tone" "chatbot_response_tone" DEFAULT 'friendly' NOT NULL,
	"response_style" "chatbot_response_style" DEFAULT 'detailed_answer' NOT NULL,
	"fallback_message" text DEFAULT 'Xin lỗi, hiện tại tôi chưa có đủ thông tin để trả lời câu hỏi này.',
	"out_of_scope_message" text DEFAULT 'Câu hỏi này nằm ngoài phạm vi hỗ trợ của chatbot.',
	"enable_human_handoff" boolean DEFAULT true NOT NULL,
	"handoff_trigger_message" text DEFAULT 'Bạn có muốn gặp tư vấn viên để được hỗ trợ trực tiếp không?',
	"max_response_length" integer DEFAULT 1000,
	"temperature" numeric(3, 2) DEFAULT 0.3,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chatbot_behavior_settings_chatbot_id_unique" UNIQUE("chatbot_id"),
	CONSTRAINT "chatbot_behavior_settings_max_response_length_check" CHECK ("chatbot_behavior_settings"."max_response_length" is null or "chatbot_behavior_settings"."max_response_length" between 200 and 3000),
	CONSTRAINT "chatbot_behavior_settings_temperature_check" CHECK ("chatbot_behavior_settings"."temperature" is null or "chatbot_behavior_settings"."temperature" between 0 and 1)
);
--> statement-breakpoint
ALTER TABLE "chatbot_behavior_settings" ADD CONSTRAINT "chatbot_behavior_settings_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
INSERT INTO "chatbot_behavior_settings" ("chatbot_id", "system_prompt")
SELECT
	"id",
	concat(
		'Bạn là ',
		coalesce("display_name", "name"),
		', trợ lý ảo. Chỉ trả lời trong phạm vi hỗ trợ và dựa trên dữ liệu tri thức đã được cung cấp. Nếu không có đủ dữ liệu, không tự suy diễn.'
	)
FROM "chatbots";--> statement-breakpoint
CREATE INDEX "chatbot_behavior_settings_response_tone_idx" ON "chatbot_behavior_settings" USING btree ("response_tone");--> statement-breakpoint
CREATE INDEX "chatbot_behavior_settings_response_style_idx" ON "chatbot_behavior_settings" USING btree ("response_style");
