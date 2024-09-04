// Responsible to list the basic data to display on the list
// TODO: Connect on DB, get all data and return
import { db } from "@/db";
import { Locales, Photos, ScheduledHours } from "@database/schema";
import { eq } from "drizzle-orm";

export type LocaleRow = {
  id: number;
  name: string;
  address: string;
  mainPhoto: {
    id: number;
    name: string;
    data: string;
  } | null;
  type: number;
  isOpen?: boolean;
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

export const scheduleAttributes = [
  "sundayHours",
  "mondayHours",
  "tuesdayHours",
  "wednesdayHours",
  "thursdayHours",
  "fridayHours",
  "saturdayHours",
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

const showLocalesService = async (category?: number) => {
  const dbConnection = await db();
  const localeRows: LocaleRow[] = category
    ? await dbConnection
        .select({
          id: Locales.id,
          name: Locales.name,
          address: Locales.address,
          mainPhoto: {
            id: Photos.id,
            name: Photos.name,
            data: Photos.data,
          },
          type: Locales.type,
        })
        .from(Locales)
        .leftJoin(Photos, eq(Locales.id, Photos.localeId))
        .where(eq(Locales.type, category))
    : await dbConnection
        .select({
          id: Locales.id,
          name: Locales.name,
          address: Locales.address,
          mainPhoto: {
            id: Photos.id,
            name: Photos.name,
            data: Photos.data,
          },
          type: Locales.type,
        })
        .from(Locales)
        .leftJoin(Photos, eq(Locales.id, Photos.localeId));

  // console.log(localeRows);

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
      const index = localeRows.findIndex(
        (locale) => locale.id === schedules.localeId,
      );
      if (index !== -1) {
        localeRows[index].isOpen = isOpen === 1;
      }
    }
  }

  return localeRows;
};

export default showLocalesService;
