// Responsible to list the basic data to display on the list
// TODO: Connect on DB, get all data and return
import { db } from "@database/db";
import { Favorites, Locales, Photos, ScheduledHours } from "@database/schema";
import { like } from "drizzle-orm";
import { or, type SQL } from "drizzle-orm";
import { sql, inArray, and, count, eq } from "drizzle-orm";

export type LocaleRow = {
  id: number;
  name: string;
  address: string;
  mainPhoto:
    | {
        id: number;
        name: string;
        data: string;
      }
    | unknown;
  type: number;
  isOpen?: boolean;
  favorite: number | unknown;
  grade: number | string;
  viewed?: number | unknown;
};

export type ScheduledHoursRow = {
  localeId: number | null; // didn't recognize as a value that can't be actually null
  sundayHours: string | null;
  mondayHours: string | null;
  tuesdayHours: string | null;
  wednesdayHours: string | null;
  thursdayHours: string | null;
  fridayHours: string | null;
  saturdayHours: string | null;
};

export type Data = {
  locales: LocaleRow[];
  totalItems: number;
};

export type LocaleError = {
  error: string;
};

type CountRow = {
  count: number;
  type?: number;
};

export const scheduleAttributes = [
  "sundayHours",
  "mondayHours",
  "tuesdayHours",
  "wednesdayHours",
  "thursdayHours",
  "fridayHours",
  "saturdayHours",
];

export const LocaleTypes: Array<string> = [
  "academicblocks", // 0
  "touristspoints", // 1
  "banks", // 2
  "restaurants", // 3
  "healthservices", // 4
  "libraries", // 5
  "sportscenters", // 6
  "transports", // 7
  "parkinglots", // 8
  "generalbuildings", // 9
];

const reduceHours = (array: string[]): number => {
  return Number.parseInt(array[0]) + Number.parseInt(array[1]) * 60;
};

export const isOpenned = (scheduleRow: ScheduledHoursRow): number => {
  const now = new Date();
  const dayAttribute: string = scheduleAttributes[now.getDay()];
  // format 15:00 - 23:00
  const scheduleHour: string[] = (
    scheduleRow[dayAttribute as keyof ScheduledHoursRow] as string
  )?.split("-");

  if (scheduleHour) {
    const startMinutes: number = reduceHours(scheduleHour[0].split(":"));
    const endHMinutes: number = reduceHours(scheduleHour[1].split(":"));
    const nowMinutes: number = now.getHours() * 60 + now.getMinutes();

    if (nowMinutes >= startMinutes && nowMinutes < endHMinutes) {
      return 1;
    }
  }
  return 0;
};
const categoryVerifier = (
  categoryList: Array<string> | Array<number>,
): Array<number> | string => {
  if (Array.isArray(categoryList) && categoryList.length > 0) {
    if (categoryList.every((category) => typeof category === "string")) {
      const categories: Array<number> = [];
      for (const category of categoryList) {
        const number: number | typeof NaN = Number.parseInt(category.trim());
        console.log("number", number, "!isNaN", !Number.isNaN(number));
        if (!Number.isNaN(number)) {
          categories.push(number);
        } else {
          const index = LocaleTypes.indexOf(category.trim().toLowerCase());

          if (index !== -1) {
            categories.push(index);
          } else {
            return `category: ${category.trim()} not found`;
          }
        }
      }
      return categories;
    }
  }
  return "";
};

/// default photo
const showLocalesService = async (
  pageNumber: number,
  limit: number,
  userId: number,
  categoryList: Array<string>,
  searchParam: string,
): Promise<Data | LocaleError> => {
  const dbConnection = await db();
  const categories = categoryVerifier(categoryList);
  if (pageNumber < 1 || limit < 1) {
    return { error: "pageNumber and / or limit must be greater than 0" };
  }

  if (!Array.isArray(categories) && categories.includes("not found")) {
    return { error: categories };
  }

  let where: SQL<unknown> | undefined;

  if (Array.isArray(categories)) {
    where = inArray(Locales.type, categories);
  }

  if (searchParam) {
    if (where) {
      where = and(
        where,
        or(
          like(Locales.name, `%${searchParam}%`),
          like(Locales.address, `%${searchParam}%`),
        ),
      );
    } else {
      where = or(
        like(Locales.name, `%${searchParam}%`),
        like(Locales.address, `%${searchParam}%`),
      );
    }
  }

  const locales: LocaleRow[] = (await dbConnection
    .select({
      id: Locales.id,
      name: Locales.name,
      address: Locales.address,
      mainPhoto: sql`(SELECT json_object('id', photo.id, 'name', photo.name, 'data', photo.data) FROM Photos as photo WHERE photo.localeId = ${Locales.id} ORDER BY photo.id ASC LIMIT 1)`,
      type: Locales.type,
      favorite: sql`CASE WHEN ${Favorites.localeId} = ${Locales.id} AND ${Favorites.userId} = ${userId} THEN true ELSE false END`,
      grade: Locales.grade,
      viewed: sql`CASE WHEN (SELECT 1 FROM (SELECT * FROM Histories WHERE userId = ${userId} ORDER BY updatedAt DESC LIMIT 10) as histories WHERE histories.localeId = ${Locales.id}) = 1 THEN true ELSE false END`,
    })
    .from(Locales)
    .leftJoin(
      Favorites,
      and(eq(Favorites.localeId, Locales.id), eq(Favorites.userId, userId)),
    )
    .where(where)
    .limit(limit)
    .offset(limit * (pageNumber - 1))) as LocaleRow[];

  const scheduleRows: ScheduledHoursRow[] = await dbConnection
    .select({
      localeId: ScheduledHours.localeId,
      sundayHours: ScheduledHours.sundayHours,
      mondayHours: ScheduledHours.mondayHours,
      tuesdayHours: ScheduledHours.tuesdayHours,
      wednesdayHours: ScheduledHours.wednesdayHours,
      thursdayHours: ScheduledHours.thursdayHours,
      fridayHours: ScheduledHours.fridayHours,
      saturdayHours: ScheduledHours.saturdayHours,
    })
    .from(ScheduledHours)
    .rightJoin(Locales, eq(Locales.id, ScheduledHours.localeId));

  for (const schedules of scheduleRows) {
    const isOpen = schedules ? isOpenned(schedules) : -1;

    if (isOpen === 1 || isOpen === 0) {
      const index = locales.findIndex(
        (locale) => locale.id === schedules.localeId,
      );
      if (index !== -1) {
        locales[index].isOpen = isOpen === 1;
      }
    }
  }

  const totalItems: number = Array.isArray(categories)
    ? (
        await dbConnection
          .select({ count: count() })
          .from(Locales)
          .where(inArray(Locales.type, categories))
      )[0].count
    : (await dbConnection.select({ count: count() }).from(Locales).where(where))[0].count;

  return {
    locales,
    totalItems,
  };
};

export default showLocalesService;
