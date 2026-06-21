ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_type" text DEFAULT 'circle';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_size" integer DEFAULT 64;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_background_color" text DEFAULT '#2563EB';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_icon_color" text DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_text" text;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_text_color" text DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_shadow" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_offset_x" integer DEFAULT 24;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_offset_y" integer DEFAULT 24;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "chat_window_shadow" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "chat_window_border_color" text DEFAULT '#E5E7EB';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "chat_window_border_width" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "chat_window_z_index" integer DEFAULT 9999;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "mobile_fullscreen_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_layout" text DEFAULT 'avatar_title';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_height" integer DEFAULT 72;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_show_status" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_status_text" text DEFAULT 'Đang hoạt động';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_status_color" text DEFAULT '#22C55E';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_show_close_button" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "message_area_background_color" text DEFAULT '#F9FAFB';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "message_area_padding" integer DEFAULT 16;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "message_spacing" integer DEFAULT 12;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "show_message_timestamp" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "message_max_width_percent" integer DEFAULT 80;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "font_family" text DEFAULT 'Inter';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "base_font_size" integer DEFAULT 14;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_title_font_size" integer DEFAULT 16;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "header_subtitle_font_size" integer DEFAULT 12;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "message_font_size" integer DEFAULT 14;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "input_font_size" integer DEFAULT 14;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "input_background_color" text DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "input_text_color" text DEFAULT '#111827';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "input_placeholder_color" text DEFAULT '#9CA3AF';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "input_border_color" text DEFAULT '#E5E7EB';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "input_border_radius" integer DEFAULT 20;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "send_button_type" text DEFAULT 'icon';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "send_button_background_color" text DEFAULT '#2563EB';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "send_button_icon_color" text DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "send_button_text" text;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "welcome_screen_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "welcome_title" text DEFAULT 'Xin chào!';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "welcome_subtitle" text;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "welcome_avatar_url" text;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "welcome_background_color" text DEFAULT '#EFF6FF';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "animation_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "launcher_animation" text DEFAULT 'pulse';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "chat_open_animation" text DEFAULT 'slide_up';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "message_animation" text DEFAULT 'fade';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "typing_indicator_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "typing_indicator_style" text DEFAULT 'dots';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "footer_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "footer_text" text DEFAULT 'Powered by UChat';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "footer_text_color" text DEFAULT '#6B7280';--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "footer_link_url" text;--> statement-breakpoint
ALTER TABLE "chatbot_ui_settings" ADD COLUMN "show_powered_by" boolean DEFAULT true NOT NULL;