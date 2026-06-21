CREATE TYPE "public"."chat_conversation_status" AS ENUM('bot_active', 'handoff_requested', 'staff_assigned', 'staff_active', 'closed');--> statement-breakpoint
CREATE TYPE "public"."chat_handoff_priority" AS ENUM('low', 'normal', 'high');--> statement-breakpoint
CREATE TYPE "public"."chat_handoff_status" AS ENUM('pending', 'assigned', 'in_progress', 'resolved', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."chat_message_answer_status" AS ENUM('answered', 'fallback', 'error');--> statement-breakpoint
CREATE TYPE "public"."chat_message_sender_type" AS ENUM('visitor', 'bot', 'staff', 'system');--> statement-breakpoint
CREATE TYPE "public"."chat_message_type" AS ENUM('text', 'system_event', 'image', 'file');--> statement-breakpoint
CREATE TABLE "chat_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"visitor_id" integer NOT NULL,
	"chatbot_id" integer NOT NULL,
	"facility_id" integer NOT NULL,
	"assigned_staff_id" integer,
	"status" "chat_conversation_status" DEFAULT 'bot_active' NOT NULL,
	"channel" text DEFAULT 'web_widget' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_message_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_handoff_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"visitor_id" integer NOT NULL,
	"chatbot_id" integer NOT NULL,
	"facility_id" integer NOT NULL,
	"assigned_staff_id" integer,
	"reason" text,
	"status" "chat_handoff_status" DEFAULT 'pending' NOT NULL,
	"priority" "chat_handoff_priority" DEFAULT 'normal' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_type" "chat_message_sender_type" NOT NULL,
	"sender_id" integer,
	"message_type" "chat_message_type" DEFAULT 'text' NOT NULL,
	"content" text,
	"answer_status" "chat_message_answer_status",
	"metadata" jsonb,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_visitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"visitor_uid" text NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"last_chatbot_id" integer,
	"last_facility_id" integer,
	"last_seen_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_visitors_visitor_uid_unique" UNIQUE("visitor_uid")
);
--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_visitor_id_chat_visitors_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."chat_visitors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_handoff_requests" ADD CONSTRAINT "chat_handoff_requests_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_handoff_requests" ADD CONSTRAINT "chat_handoff_requests_visitor_id_chat_visitors_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."chat_visitors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_handoff_requests" ADD CONSTRAINT "chat_handoff_requests_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_handoff_requests" ADD CONSTRAINT "chat_handoff_requests_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_handoff_requests" ADD CONSTRAINT "chat_handoff_requests_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_visitors" ADD CONSTRAINT "chat_visitors_last_chatbot_id_chatbots_id_fk" FOREIGN KEY ("last_chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_visitors" ADD CONSTRAINT "chat_visitors_last_facility_id_facilities_id_fk" FOREIGN KEY ("last_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_conversations_visitor_id_idx" ON "chat_conversations" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_chatbot_id_idx" ON "chat_conversations" USING btree ("chatbot_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_facility_id_idx" ON "chat_conversations" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_assigned_staff_id_idx" ON "chat_conversations" USING btree ("assigned_staff_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_status_idx" ON "chat_conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_conversations_last_message_at_idx" ON "chat_conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_conversations_open_visitor_chatbot_unique" ON "chat_conversations" USING btree ("visitor_id","chatbot_id") WHERE "chat_conversations"."status" <> 'closed';--> statement-breakpoint
CREATE INDEX "chat_handoff_requests_conversation_id_idx" ON "chat_handoff_requests" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "chat_handoff_requests_visitor_id_idx" ON "chat_handoff_requests" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "chat_handoff_requests_chatbot_id_idx" ON "chat_handoff_requests" USING btree ("chatbot_id");--> statement-breakpoint
CREATE INDEX "chat_handoff_requests_facility_id_idx" ON "chat_handoff_requests" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "chat_handoff_requests_assigned_staff_id_idx" ON "chat_handoff_requests" USING btree ("assigned_staff_id");--> statement-breakpoint
CREATE INDEX "chat_handoff_requests_status_idx" ON "chat_handoff_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_handoff_requests_requested_at_idx" ON "chat_handoff_requests" USING btree ("requested_at");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_handoff_requests_open_conversation_unique" ON "chat_handoff_requests" USING btree ("conversation_id") WHERE "chat_handoff_requests"."status" in ('pending', 'assigned', 'in_progress');--> statement-breakpoint
CREATE INDEX "chat_messages_conversation_id_idx" ON "chat_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "chat_messages_sender_type_idx" ON "chat_messages" USING btree ("sender_type");--> statement-breakpoint
CREATE INDEX "chat_messages_answer_status_idx" ON "chat_messages" USING btree ("answer_status");--> statement-breakpoint
CREATE INDEX "chat_messages_sent_at_idx" ON "chat_messages" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "chat_visitors_last_chatbot_id_idx" ON "chat_visitors" USING btree ("last_chatbot_id");--> statement-breakpoint
CREATE INDEX "chat_visitors_last_facility_id_idx" ON "chat_visitors" USING btree ("last_facility_id");--> statement-breakpoint
CREATE INDEX "chat_visitors_last_seen_at_idx" ON "chat_visitors" USING btree ("last_seen_at");--> statement-breakpoint
