import { pgTable, serial, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userPreferencesTable = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  language: text("language").default("en").notNull(),
  defaultBudget: numeric("default_budget", { precision: 10, scale: 2 }),
  defaultNumberOfPeople: integer("default_number_of_people"),
  defaultDepartureLocation: text("default_departure_location"),
  defaultFlightPreference: text("default_flight_preference"),
  cookieConsent: boolean("cookie_consent").default(false).notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  tripSearchCount: integer("trip_search_count").default(0).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferencesTable).omit({ id: true, createdAt: true });
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferencesTable.$inferSelect;
