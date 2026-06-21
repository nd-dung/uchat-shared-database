import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const facilityStatusEnum = pgEnum('facility_status', [
  'active',
  'inactive',
]);

export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'facility_admin',
  'facility_staff',
]);

export const userStatusEnum = pgEnum('user_status', ['active', 'inactive']);

export const chatbotStatusEnum = pgEnum('chatbot_status', [
  'active',
  'inactive',
  'draft',
]);

export const chatWindowPositionEnum = pgEnum('chat_window_position', [
  'bottom_right',
  'bottom_left',
]);

export const chatConversationStatusEnum = pgEnum('chat_conversation_status', [
  'bot_active',
  'handoff_requested',
  'staff_assigned',
  'staff_active',
  'closed',
]);

export const chatMessageSenderTypeEnum = pgEnum('chat_message_sender_type', [
  'visitor',
  'bot',
  'staff',
  'system',
]);

export const chatMessageTypeEnum = pgEnum('chat_message_type', [
  'text',
  'system_event',
  'image',
  'file',
]);

export const chatMessageAnswerStatusEnum = pgEnum(
  'chat_message_answer_status',
  ['answered', 'fallback', 'error'],
);

export const chatHandoffStatusEnum = pgEnum('chat_handoff_status', [
  'pending',
  'assigned',
  'in_progress',
  'resolved',
  'cancelled',
]);

export const chatHandoffPriorityEnum = pgEnum('chat_handoff_priority', [
  'low',
  'normal',
  'high',
]);

export const chatFeedbackStatusEnum = pgEnum('chat_feedback_status', [
  'new',
  'reviewing',
  'resolved',
  'ignored',
]);

export const chatMessageFeedbackTypeEnum = pgEnum(
  'chat_message_feedback_type',
  [
    'helpful',
    'not_helpful',
    'incorrect',
    'not_enough_information',
    'need_human_support',
  ],
);

export const chatSatisfactionLevelEnum = pgEnum('chat_satisfaction_level', [
  'satisfied',
  'neutral',
  'unsatisfied',
]);

export const chatbotResponseToneEnum = pgEnum('chatbot_response_tone', [
  'friendly',
  'professional',
  'formal',
  'concise',
]);

export const chatbotResponseStyleEnum = pgEnum('chatbot_response_style', [
  'short_answer',
  'detailed_answer',
  'step_by_step',
  'faq_style',
]);

export const facilities = pgTable(
  'facilities',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    status: facilityStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('facilities_status_idx').on(table.status)],
);

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    facilityId: integer('facility_id').references(() => facilities.id),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    avatar: text('avatar'),
    role: userRoleEnum('role').notNull(),
    status: userStatusEnum('status').notNull().default('active'),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('users_facility_id_idx').on(table.facilityId),
    index('users_role_idx').on(table.role),
    index('users_status_idx').on(table.status),
    index('users_facility_created_at_idx').on(
      table.facilityId,
      table.createdAt,
    ),
    index('users_facility_last_login_at_idx').on(
      table.facilityId,
      table.lastLoginAt,
    ),
  ],
);

export const chatbots = pgTable(
  'chatbots',
  {
    id: serial('id').primaryKey(),
    facilityId: integer('facility_id')
      .notNull()
      .references(() => facilities.id)
      .unique(),
    name: text('name').notNull(),
    displayName: text('display_name'),
    description: text('description'),
    status: chatbotStatusEnum('status').notNull().default('draft'),
    createdBy: integer('created_by').references(() => users.id),
    updatedBy: integer('updated_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('chatbots_status_idx').on(table.status),
    index('chatbots_deleted_at_idx').on(table.deletedAt),
  ],
);

export const chatbotUiSettings = pgTable('chatbot_ui_settings', {
  id: serial('id').primaryKey(),
  chatbotId: integer('chatbot_id')
    .notNull()
    .references(() => chatbots.id)
    .unique(),
  launcherType: text('launcher_type').default('circle'),
  launcherSize: integer('launcher_size').default(64),
  launcherBackgroundColor: text('launcher_background_color').default('#2563EB'),
  launcherIconColor: text('launcher_icon_color').default('#FFFFFF'),
  launcherText: text('launcher_text'),
  launcherTextColor: text('launcher_text_color').default('#FFFFFF'),
  launcherShadow: boolean('launcher_shadow').notNull().default(true),
  launcherOffsetX: integer('launcher_offset_x').default(24),
  launcherOffsetY: integer('launcher_offset_y').default(24),
  chatWindowShadow: boolean('chat_window_shadow').notNull().default(true),
  chatWindowBorderColor: text('chat_window_border_color').default('#E5E7EB'),
  chatWindowBorderWidth: integer('chat_window_border_width').default(1),
  chatWindowZIndex: integer('chat_window_z_index').default(9999),
  mobileFullscreenEnabled: boolean('mobile_fullscreen_enabled')
    .notNull()
    .default(true),
  headerLayout: text('header_layout').default('avatar_title'),
  headerHeight: integer('header_height').default(72),
  headerShowStatus: boolean('header_show_status').notNull().default(true),
  headerStatusText: text('header_status_text').default('Đang hoạt động'),
  headerStatusColor: text('header_status_color').default('#22C55E'),
  headerShowCloseButton: boolean('header_show_close_button')
    .notNull()
    .default(true),
  messageAreaBackgroundColor: text('message_area_background_color').default(
    '#F9FAFB',
  ),
  messageAreaPadding: integer('message_area_padding').default(16),
  messageSpacing: integer('message_spacing').default(12),
  showMessageTimestamp: boolean('show_message_timestamp')
    .notNull()
    .default(false),
  messageMaxWidthPercent: integer('message_max_width_percent').default(80),
  fontFamily: text('font_family').default('Inter'),
  baseFontSize: integer('base_font_size').default(14),
  headerTitleFontSize: integer('header_title_font_size').default(16),
  headerSubtitleFontSize: integer('header_subtitle_font_size').default(12),
  messageFontSize: integer('message_font_size').default(14),
  inputFontSize: integer('input_font_size').default(14),
  inputBackgroundColor: text('input_background_color').default('#FFFFFF'),
  inputTextColor: text('input_text_color').default('#111827'),
  inputPlaceholderColor: text('input_placeholder_color').default('#9CA3AF'),
  inputBorderColor: text('input_border_color').default('#E5E7EB'),
  inputBorderRadius: integer('input_border_radius').default(20),
  sendButtonType: text('send_button_type').default('icon'),
  sendButtonBackgroundColor: text('send_button_background_color').default(
    '#2563EB',
  ),
  sendButtonIconColor: text('send_button_icon_color').default('#FFFFFF'),
  sendButtonText: text('send_button_text'),
  welcomeScreenEnabled: boolean('welcome_screen_enabled')
    .notNull()
    .default(true),
  welcomeTitle: text('welcome_title').default('Xin chào!'),
  welcomeSubtitle: text('welcome_subtitle'),
  welcomeAvatarUrl: text('welcome_avatar_url'),
  welcomeBackgroundColor: text('welcome_background_color').default('#EFF6FF'),
  animationEnabled: boolean('animation_enabled').notNull().default(true),
  launcherAnimation: text('launcher_animation').default('pulse'),
  chatOpenAnimation: text('chat_open_animation').default('slide_up'),
  messageAnimation: text('message_animation').default('fade'),
  typingIndicatorEnabled: boolean('typing_indicator_enabled')
    .notNull()
    .default(true),
  typingIndicatorStyle: text('typing_indicator_style').default('dots'),
  footerEnabled: boolean('footer_enabled').notNull().default(true),
  footerText: text('footer_text').default('Powered by UChat'),
  footerTextColor: text('footer_text_color').default('#6B7280'),
  footerLinkUrl: text('footer_link_url'),
  showPoweredBy: boolean('show_powered_by').notNull().default(true),
  primaryColor: text('primary_color').default('#2563EB'),
  backgroundColor: text('background_color').default('#FFFFFF'),
  headerBackgroundColor: text('header_background_color').default('#2563EB'),
  headerTextColor: text('header_text_color').default('#FFFFFF'),
  botMessageBackgroundColor: text('bot_message_background_color').default(
    '#F3F4F6',
  ),
  botMessageTextColor: text('bot_message_text_color').default('#111827'),
  userMessageBackgroundColor: text('user_message_background_color').default(
    '#2563EB',
  ),
  userMessageTextColor: text('user_message_text_color').default('#FFFFFF'),
  avatarUrl: text('avatar_url'),
  logoUrl: text('logo_url'),
  launcherIconUrl: text('launcher_icon_url'),
  headerTitle: text('header_title'),
  headerSubtitle: text('header_subtitle'),
  welcomeMessage: text('welcome_message').default(
    'Xin chào! Tôi có thể hỗ trợ gì cho bạn?',
  ),
  placeholderText: text('placeholder_text').default('Nhập câu hỏi của bạn...'),
  chatWindowPosition: chatWindowPositionEnum('chat_window_position')
    .notNull()
    .default('bottom_right'),
  chatWindowWidth: integer('chat_window_width').default(380),
  chatWindowHeight: integer('chat_window_height').default(600),
  borderRadius: integer('border_radius').default(16),
  messageBubbleRadius: integer('message_bubble_radius').default(12),
  showAvatar: boolean('show_avatar').notNull().default(true),
  showLogo: boolean('show_logo').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const chatbotBehaviorSettings = pgTable(
  'chatbot_behavior_settings',
  {
    id: serial('id').primaryKey(),
    chatbotId: integer('chatbot_id')
      .notNull()
      .references(() => chatbots.id)
      .unique(),
    systemPrompt: text('system_prompt'),
    supportScope: text('support_scope'),
    responseTone: chatbotResponseToneEnum('response_tone')
      .notNull()
      .default('friendly'),
    responseStyle: chatbotResponseStyleEnum('response_style')
      .notNull()
      .default('detailed_answer'),
    fallbackMessage: text('fallback_message').default(
      'Xin lỗi, hiện tại tôi chưa có đủ thông tin để trả lời câu hỏi này.',
    ),
    outOfScopeMessage: text('out_of_scope_message').default(
      'Câu hỏi này nằm ngoài phạm vi hỗ trợ của chatbot.',
    ),
    enableHumanHandoff: boolean('enable_human_handoff').notNull().default(true),
    handoffTriggerMessage: text('handoff_trigger_message').default(
      'Bạn có muốn gặp tư vấn viên để được hỗ trợ trực tiếp không?',
    ),
    maxResponseLength: integer('max_response_length').default(1000),
    temperature: numeric('temperature', {
      precision: 3,
      scale: 2,
      mode: 'number',
    }).default(0.3),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chatbot_behavior_settings_response_tone_idx').on(table.responseTone),
    index('chatbot_behavior_settings_response_style_idx').on(
      table.responseStyle,
    ),
    check(
      'chatbot_behavior_settings_max_response_length_check',
      sql`${table.maxResponseLength} is null or ${table.maxResponseLength} between 200 and 3000`,
    ),
    check(
      'chatbot_behavior_settings_temperature_check',
      sql`${table.temperature} is null or ${table.temperature} between 0 and 1`,
    ),
  ],
);

export const chatVisitors = pgTable(
  'chat_visitors',
  {
    id: serial('id').primaryKey(),
    visitorUid: text('visitor_uid').notNull().unique(),
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    lastChatbotId: integer('last_chatbot_id').references(() => chatbots.id),
    lastFacilityId: integer('last_facility_id').references(() => facilities.id),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chat_visitors_last_chatbot_id_idx').on(table.lastChatbotId),
    index('chat_visitors_last_facility_id_idx').on(table.lastFacilityId),
    index('chat_visitors_last_seen_at_idx').on(table.lastSeenAt),
  ],
);

export const chatConversations = pgTable(
  'chat_conversations',
  {
    id: serial('id').primaryKey(),
    visitorId: integer('visitor_id')
      .notNull()
      .references(() => chatVisitors.id),
    chatbotId: integer('chatbot_id')
      .notNull()
      .references(() => chatbots.id),
    facilityId: integer('facility_id')
      .notNull()
      .references(() => facilities.id),
    assignedStaffId: integer('assigned_staff_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: chatConversationStatusEnum('status')
      .notNull()
      .default('bot_active'),
    channel: text('channel').notNull().default('web_widget'),
    startedAt: timestamp('started_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chat_conversations_visitor_id_idx').on(table.visitorId),
    index('chat_conversations_chatbot_id_idx').on(table.chatbotId),
    index('chat_conversations_facility_id_idx').on(table.facilityId),
    index('chat_conversations_assigned_staff_id_idx').on(table.assignedStaffId),
    index('chat_conversations_status_idx').on(table.status),
    index('chat_conversations_last_message_at_idx').on(table.lastMessageAt),
    uniqueIndex('chat_conversations_open_visitor_chatbot_unique')
      .on(table.visitorId, table.chatbotId)
      .where(sql`${table.status} <> 'closed'`),
  ],
);

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id')
      .notNull()
      .references(() => chatConversations.id),
    senderType: chatMessageSenderTypeEnum('sender_type').notNull(),
    senderId: integer('sender_id'),
    messageType: chatMessageTypeEnum('message_type').notNull().default('text'),
    content: text('content'),
    answerStatus: chatMessageAnswerStatusEnum('answer_status'),
    metadata: jsonb('metadata'),
    sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chat_messages_conversation_id_idx').on(table.conversationId),
    index('chat_messages_sender_type_idx').on(table.senderType),
    index('chat_messages_answer_status_idx').on(table.answerStatus),
    index('chat_messages_sent_at_idx').on(table.sentAt),
  ],
);

export const chatHandoffRequests = pgTable(
  'chat_handoff_requests',
  {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id')
      .notNull()
      .references(() => chatConversations.id),
    visitorId: integer('visitor_id')
      .notNull()
      .references(() => chatVisitors.id),
    chatbotId: integer('chatbot_id')
      .notNull()
      .references(() => chatbots.id),
    facilityId: integer('facility_id')
      .notNull()
      .references(() => facilities.id),
    assignedStaffId: integer('assigned_staff_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    reason: text('reason'),
    status: chatHandoffStatusEnum('status').notNull().default('pending'),
    priority: chatHandoffPriorityEnum('priority').notNull().default('normal'),
    requestedAt: timestamp('requested_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    assignedAt: timestamp('assigned_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chat_handoff_requests_conversation_id_idx').on(table.conversationId),
    index('chat_handoff_requests_visitor_id_idx').on(table.visitorId),
    index('chat_handoff_requests_chatbot_id_idx').on(table.chatbotId),
    index('chat_handoff_requests_facility_id_idx').on(table.facilityId),
    index('chat_handoff_requests_assigned_staff_id_idx').on(
      table.assignedStaffId,
    ),
    index('chat_handoff_requests_status_idx').on(table.status),
    index('chat_handoff_requests_requested_at_idx').on(table.requestedAt),
    uniqueIndex('chat_handoff_requests_open_conversation_unique')
      .on(table.conversationId)
      .where(sql`${table.status} in ('pending', 'assigned', 'in_progress')`),
  ],
);

export const chatMessageFeedbacks = pgTable(
  'chat_message_feedbacks',
  {
    id: serial('id').primaryKey(),
    messageId: integer('message_id')
      .notNull()
      .references(() => chatMessages.id),
    conversationId: integer('conversation_id')
      .notNull()
      .references(() => chatConversations.id),
    visitorId: integer('visitor_id')
      .notNull()
      .references(() => chatVisitors.id),
    chatbotId: integer('chatbot_id')
      .notNull()
      .references(() => chatbots.id),
    facilityId: integer('facility_id')
      .notNull()
      .references(() => facilities.id),
    feedbackType: chatMessageFeedbackTypeEnum('feedback_type').notNull(),
    rating: integer('rating'),
    comment: text('comment'),
    status: chatFeedbackStatusEnum('status').notNull().default('new'),
    reviewedBy: integer('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chat_message_feedbacks_message_id_idx').on(table.messageId),
    index('chat_message_feedbacks_conversation_id_idx').on(
      table.conversationId,
    ),
    index('chat_message_feedbacks_visitor_id_idx').on(table.visitorId),
    index('chat_message_feedbacks_chatbot_id_idx').on(table.chatbotId),
    index('chat_message_feedbacks_facility_id_idx').on(table.facilityId),
    index('chat_message_feedbacks_feedback_type_idx').on(table.feedbackType),
    index('chat_message_feedbacks_status_idx').on(table.status),
    unique('chat_message_feedbacks_message_visitor_unique').on(
      table.messageId,
      table.visitorId,
    ),
    check(
      'chat_message_feedbacks_rating_check',
      sql`${table.rating} is null or ${table.rating} between 1 and 5`,
    ),
  ],
);

export const chatConversationFeedbacks = pgTable(
  'chat_conversation_feedbacks',
  {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id')
      .notNull()
      .references(() => chatConversations.id),
    visitorId: integer('visitor_id')
      .notNull()
      .references(() => chatVisitors.id),
    chatbotId: integer('chatbot_id')
      .notNull()
      .references(() => chatbots.id),
    facilityId: integer('facility_id')
      .notNull()
      .references(() => facilities.id),
    rating: integer('rating'),
    satisfactionLevel: chatSatisfactionLevelEnum('satisfaction_level'),
    comment: text('comment'),
    status: chatFeedbackStatusEnum('status').notNull().default('new'),
    reviewedBy: integer('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chat_conversation_feedbacks_conversation_id_idx').on(
      table.conversationId,
    ),
    index('chat_conversation_feedbacks_visitor_id_idx').on(table.visitorId),
    index('chat_conversation_feedbacks_chatbot_id_idx').on(table.chatbotId),
    index('chat_conversation_feedbacks_facility_id_idx').on(table.facilityId),
    index('chat_conversation_feedbacks_rating_idx').on(table.rating),
    index('chat_conversation_feedbacks_satisfaction_level_idx').on(
      table.satisfactionLevel,
    ),
    index('chat_conversation_feedbacks_status_idx').on(table.status),
    unique('chat_conversation_feedbacks_conversation_visitor_unique').on(
      table.conversationId,
      table.visitorId,
    ),
    check(
      'chat_conversation_feedbacks_rating_check',
      sql`${table.rating} is null or ${table.rating} between 1 and 5`,
    ),
  ],
);

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const userPermissions = pgTable(
  'user_permissions',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    permissionId: integer('permission_id')
      .notNull()
      .references(() => permissions.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.userId, table.permissionId)],
);

export type Facility = typeof facilities.$inferSelect;
export type NewFacility = typeof facilities.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Chatbot = typeof chatbots.$inferSelect;
export type NewChatbot = typeof chatbots.$inferInsert;
export type ChatbotUiSetting = typeof chatbotUiSettings.$inferSelect;
export type NewChatbotUiSetting = typeof chatbotUiSettings.$inferInsert;
export type ChatbotBehaviorSetting =
  typeof chatbotBehaviorSettings.$inferSelect;
export type NewChatbotBehaviorSetting =
  typeof chatbotBehaviorSettings.$inferInsert;
export type ChatVisitor = typeof chatVisitors.$inferSelect;
export type NewChatVisitor = typeof chatVisitors.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type NewChatConversation = typeof chatConversations.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type ChatHandoffRequest = typeof chatHandoffRequests.$inferSelect;
export type NewChatHandoffRequest = typeof chatHandoffRequests.$inferInsert;
export type ChatMessageFeedback = typeof chatMessageFeedbacks.$inferSelect;
export type NewChatMessageFeedback = typeof chatMessageFeedbacks.$inferInsert;
export type ChatConversationFeedback =
  typeof chatConversationFeedbacks.$inferSelect;
export type NewChatConversationFeedback =
  typeof chatConversationFeedbacks.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
export type UserPermission = typeof userPermissions.$inferSelect;
export type NewUserPermission = typeof userPermissions.$inferInsert;
