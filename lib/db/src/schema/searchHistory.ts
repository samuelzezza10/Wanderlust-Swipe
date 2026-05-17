import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const searchHistoryTable = pgTable("search_history", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  departureLocation: text("departure_location"),
  arrivalLocation: text("arrival_location"),
  departureDate: text("departure_date"),
  returnDate: text("return_date"),
  budget: integer("budget"),
  numberOfPeople: integer("number_of_people"),
  numberOfNights: integer("number_of_nights"),
  tripType: text("trip_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SearchHistory = typeof searchHistoryTable.$inferSelect;
