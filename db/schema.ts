import { pgTable, serial, text, varchar, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core';

// PDPL & ZATCA Compliant Schema - No CC data storage

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phoneNumber: varchar('phone_number', { length: 20 }).unique(), // Core auth method
  nafathId: varchar('nafath_id', { length: 50 }).unique(), // KSA ID Auth
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }), // Optional or used for OAuth
  role: varchar('role', { length: 50 }).default('user'), // user, admin, agent
  isVerified: boolean('is_verified').default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  titleAr: varchar('title_ar', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleUr: varchar('title_ur', { length: 255 }),
  descriptionAr: text('description_ar'),
  descriptionEn: text('description_en'),
  descriptionUr: text('description_ur'),
  price: varchar('price', { length: 50 }),
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata'), // ZATCA relevant classification
  createdAt: timestamp('created_at').defaultNow(),
});

export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id),
  storeNameAr: varchar('store_name_ar', { length: 255 }).notNull(),
  storeNameEn: varchar('store_name_en', { length: 255 }).notNull(),
  crNumber: varchar('cr_number', { length: 20 }), // Commercial Registration
  zatcaPhase2Ready: boolean('zatca_phase_2_ready').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const recruitment = pgTable('recruitment', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicantName: varchar('applicant_name', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }),
  portfolioUrl: varchar('portfolio_url', { length: 500 }),
  coverLetter: text('cover_letter'),
  status: varchar('status', { length: 50 }).default('pending'), // pending, reviewed, accepted, rejected
  createdAt: timestamp('created_at').defaultNow(),
});

export const aiLogs = pgTable('ai_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentNode: varchar('agent_node', { length: 100 }).notNull(), // Coordinator, Builder, Vision, etc.
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  processingTimeMs: serial('processing_time_ms'),
  status: varchar('status', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
});
