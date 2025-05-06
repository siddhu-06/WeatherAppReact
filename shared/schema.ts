import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Cities schema
export const cities = pgTable("cities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ascii_name: text("ascii_name").notNull(),
  country_code: text("country_code").notNull(),
  country_name: text("country_name").notNull(),
  population: integer("population").notNull(),
  timezone: text("timezone").notNull(),
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
  data: jsonb("data")
});

export const insertCitySchema = createInsertSchema(cities);

// Favorite cities for users
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  cityId: text("city_id").references(() => cities.id).notNull(),
});

// Relations setup
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

export const citiesRelations = relations(cities, ({ many }) => ({
  favorites: many(favorites),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  city: one(cities, {
    fields: [favorites.cityId],
    references: [cities.id],
  }),
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type Favorite = typeof favorites.$inferSelect;
