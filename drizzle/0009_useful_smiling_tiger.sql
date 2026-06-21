CREATE TYPE "public"."chat_feedback_status" AS ENUM('new', 'reviewing', 'resolved', 'ignored');--> statement-breakpoint
CREATE TYPE "public"."chat_message_feedback_type" AS ENUM('helpful', 'not_helpful', 'incorrect', 'not_enough_information', 'need_human_support');--> statement-breakpoint
CREATE TYPE "public"."chat_satisfaction_level" AS ENUM('satisfied', 'neutral', 'unsatisfied');--> statement-breakpoint
CREATE TABLE "chat_conversation_feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"visitor_id" integer NOT NULL,
	"chatbot_id" integer NOT NULL,
	"facility_id" integer NOT NULL,
	"rating" integer,
	"satisfaction_level" "chat_satisfaction_level",
	"comment" text,
	"status" "chat_feedback_status" DEFAULT 'new' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_conversation_feedbacks_conversation_visitor_unique" UNIQUE("conversation_id","visitor_id"),
	CONSTRAINT "chat_conversation_feedbacks_rating_check" CHECK ("chat_conversation_feedbacks"."rating" is null or "chat_conversation_feedbacks"."rating" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "chat_message_feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"conversation_id" integer NOT NULL,
	"visitor_id" integer NOT NULL,
	"chatbot_id" integer NOT NULL,
	"facility_id" integer NOT NULL,
	"feedback_type" "chat_message_feedback_type" NOT NULL,
	"rating" integer,
	"comment" text,
	"status" "chat_feedback_status" DEFAULT 'new' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_message_feedbacks_message_visitor_unique" UNIQUE("message_id","visitor_id"),
	CONSTRAINT "chat_message_feedbacks_rating_check" CHECK ("chat_message_feedbacks"."rating" is null or "chat_message_feedbacks"."rating" between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "chat_conversation_feedbacks" ADD CONSTRAINT "chat_conversation_feedbacks_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversation_feedbacks" ADD CONSTRAINT "chat_conversation_feedbacks_visitor_id_chat_visitors_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."chat_visitors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversation_feedbacks" ADD CONSTRAINT "chat_conversation_feedbacks_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversation_feedbacks" ADD CONSTRAINT "chat_conversation_feedbacks_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversation_feedbacks" ADD CONSTRAINT "chat_conversation_feedbacks_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message_feedbacks" ADD CONSTRAINT "chat_message_feedbacks_message_id_chat_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message_feedbacks" ADD CONSTRAINT "chat_message_feedbacks_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message_feedbacks" ADD CONSTRAINT "chat_message_feedbacks_visitor_id_chat_visitors_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."chat_visitors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message_feedbacks" ADD CONSTRAINT "chat_message_feedbacks_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message_feedbacks" ADD CONSTRAINT "chat_message_feedbacks_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message_feedbacks" ADD CONSTRAINT "chat_message_feedbacks_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_conversation_feedbacks_conversation_id_idx" ON "chat_conversation_feedbacks" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "chat_conversation_feedbacks_visitor_id_idx" ON "chat_conversation_feedbacks" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "chat_conversation_feedbacks_chatbot_id_idx" ON "chat_conversation_feedbacks" USING btree ("chatbot_id");--> statement-breakpoint
CREATE INDEX "chat_conversation_feedbacks_facility_id_idx" ON "chat_conversation_feedbacks" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "chat_conversation_feedbacks_rating_idx" ON "chat_conversation_feedbacks" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "chat_conversation_feedbacks_satisfaction_level_idx" ON "chat_conversation_feedbacks" USING btree ("satisfaction_level");--> statement-breakpoint
CREATE INDEX "chat_conversation_feedbacks_status_idx" ON "chat_conversation_feedbacks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_message_feedbacks_message_id_idx" ON "chat_message_feedbacks" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "chat_message_feedbacks_conversation_id_idx" ON "chat_message_feedbacks" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "chat_message_feedbacks_visitor_id_idx" ON "chat_message_feedbacks" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "chat_message_feedbacks_chatbot_id_idx" ON "chat_message_feedbacks" USING btree ("chatbot_id");--> statement-breakpoint
CREATE INDEX "chat_message_feedbacks_facility_id_idx" ON "chat_message_feedbacks" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "chat_message_feedbacks_feedback_type_idx" ON "chat_message_feedbacks" USING btree ("feedback_type");--> statement-breakpoint
CREATE INDEX "chat_message_feedbacks_status_idx" ON "chat_message_feedbacks" USING btree ("status");