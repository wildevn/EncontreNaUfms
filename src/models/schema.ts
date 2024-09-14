import { mysqlTable, text, int, date, varchar, tinyint, decimal, mediumtext } from 'drizzle-orm/mysql-core';

export const Users = mysqlTable('Users', {
  id: int('id').notNull().autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: date('createdAt').notNull(),
  updatedAt: date('updatedAt').notNull(),
});

export const Locales = mysqlTable("Locales", {
  id: int("id").notNull().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  localizationLink: varchar("localization_link", { length: 255 }).notNull(),
  address: varchar("address", { length: 60 }).notNull(),
  about: text("about"),
  observation: text("observation"),
  type: tinyint("type").notNull(),
  phoneNumber: varchar("phone_number", { length: 11 }),
  accessibility: tinyint("accessibility"),
  grade: decimal("grade", { precision: 10, scale: 2 }).notNull(),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
});

export const ScheduledHours = mysqlTable("ScheduledHours", {
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(), // TODO: verify the foreign key
  sundayHours: varchar("sundayHours", { length: 20 }),
  mondayHours: varchar("mondayHours", { length: 20 }),
  tuesdayHours: varchar("tuesdayHours", { length: 20 }),
  wednesdayHours: varchar("wednesdayHours", { length: 20 }),
  thursdayHours: varchar("thursdayHours", { length: 20 }),
  fridayHours: varchar("fridayHours", { length: 20 }),
  saturdayHours: varchar("saturdayHours", { length: 20 }),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
});

export const Photos = mysqlTable("Photos", {
  id: int("id").notNull().autoincrement().primaryKey(),
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  data: mediumtext("data").notNull(),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})

export const Favorites = mysqlTable("Favorites", {
  userId: int("userId").notNull(),
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})

export const Histories = mysqlTable("Histories", {
  userId: int("userId").notNull(),
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})

export const Reviews = mysqlTable("Reviews", {
  userId: int("userId").notNull().references(() => Users.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  grade: decimal("grade").notNull().default("0.0"),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})

export const AcademicBlocks = mysqlTable("AcademicBlocks", {
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  course: varchar("course", { length: 30 }).notNull(),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})

export const Libraries = mysqlTable("Libraries", {
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  libraryLink: varchar("libraryLink", { length: 30 }).notNull(),
  rules: text("rules"),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})

export const Sports = mysqlTable("Sports", {
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  availableSports: varchar("availableSports", { length: 255 }).notNull(),
  rules: text("rules"),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})

export const Transports = mysqlTable("Transports", {
  localeId: int("localeId").notNull().references(() => Locales.id, { onDelete: 'cascade', onUpdate: 'cascade' }).unique(),
  availableBuses: varchar("availableBuses", { length: 30 }).notNull(),
  rules: text("rules"),
  createdAt: date("createdAt").notNull(),
  updatedAt: date("updatedAt").notNull(),
})