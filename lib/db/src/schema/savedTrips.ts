import { pgTable, serial, text, numeric, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savedTripsTable = pgTable("saved_trips", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  destination: text("destination").notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  shareToken: text("share_token"),
  tripData: jsonb("trip_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedTripSchema = createInsertSchema(savedTripsTable).omit({ id: true, createdAt: true });
export type InsertSavedTrip = z.infer<typeof insertSavedTripSchema>;
export type SavedTrip = typeof savedTripsTable.$inferSelect;
