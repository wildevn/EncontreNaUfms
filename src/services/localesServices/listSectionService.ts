import { getDbConnection } from "@/models/db";
import {
  AcademicBlocks,
  Libraries,
  Locales,
  ScheduledHours,
  Sports,
  Transports,
} from "@/models/schema";
import { eq, sql } from "drizzle-orm";
import deleteOldestHitoryLocaleService from "./deleteOldestHitoryLocaleService";

export type Hours = {
  sundayHours: string;
  mondayHours: string;
  tuesdayHours: string;
  wednesdayHours: string;
  thursdayHours: string;
  fridayHours: string;
  saturdayHours: string;
};

type MoreInfo = {
  about: string;
  observation: string;
  phoneNumber: string;
  type: number;
  course: string;
  libraryLink: string;
  availableSports: string;
  availableBuses: string;
  rules: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Localization = {
  id: number;
  name: string;
  address: string;
  localizationLink: string;
  latitude: number;
  longitude: number;
  accessibility: string;
  photos: Array<{
    id: number;
    name: string;
    url: string;
  }>;
  grade: number;
  favorite: boolean;
  about?: string;
  observation?: string;
  type?: number;
  phoneNumber?: string;
  schedule?: Hours;
  specialInfo?: MoreInfo;
};

type ResultReply = {
  result?: Localization | Hours | MoreInfo;
  error?: string;
  status: number;
};

const LocaleSections: Array<string> = [
  "basic", // 0
  "localization", // 1
  "hours", // 2
  "moreinfo", // 3
  "all", // 4
];

const getTableName = (
  type: number,
):
  | typeof AcademicBlocks
  | typeof Libraries
  | typeof Sports
  | typeof Transports => {
  switch (type) {
    case 0:
      return AcademicBlocks;
    case 5:
      return Libraries;
    case 6:
      return Sports;
    case 7:
      return Transports;
    default:
      return AcademicBlocks;
  }
};

const sectionVerifier = (sectionId: string): number => {
  const number: number | typeof NaN = Number.parseInt(sectionId);
  if (!Number.isNaN(number)) {
    if (number >= 0 && number <= LocaleSections.length - 1) {
      return number;
    }
  } else {
    return LocaleSections.indexOf(sectionId.toLowerCase());
  }
  return -1;
};

const listSectionService = async (
  localeId: number,
  userId: number,
  sectionId: string,
): Promise<ResultReply | undefined> => {
  let result: Localization[] | Localization | Hours | MoreInfo | undefined;
  const db = await getDbConnection();
  const index: number = sectionVerifier(sectionId);

  if (index === -1) {
    return { error: "Section not found", status: 404 };
  }

  try {
    if (index === 0) {
      if (userId > 0) {
        try {
          await deleteOldestHitoryLocaleService(userId, localeId);
        } catch (error) {
          console.log("\n\nerror ocurred: ", error);
        }
      }

      result = (
        await db.execute(sql`
        SELECT 
          locale.id,
          locale.name,
          locale.accessibility,
          json_arrayagg(json_object('id', photo.id, 'name', photo.name, 'url', photo.url)) as photos,
          locale.grade,
          CASE WHEN favorite.localeId = locale.id AND favorite.userId = ${userId} THEN true ELSE false END as favorite
        FROM 
          Locales AS locale
        LEFT JOIN
          Photos AS photo ON locale.id = photo.localeId
        LEFT JOIN
          Favorites AS favorite ON locale.id = favorite.localeId AND favorite.userId = ${userId}
        WHERE
          locale.id = ${localeId}
        `)
      )[0] as unknown as Localization[];

      // if (result[0]) {
      //   console.log("\n\nresult: ", result[0].photos);
      // }

      return { result: result[0], status: 200 };
    }
    if (index === 1) {
      result = (
        await db
          .select({
            address: Locales.address,
            localizationLink: Locales.localizationLink,
            latitude: Locales.latitude,
            longitude: Locales.longitude,
          })
          .from(Locales)
          .where(eq(Locales.id, localeId))
      )[0] as unknown as Localization;

      return { result, status: 200 };
    }
    if (index === 2) {
      result = (
        await db
          .select({
            sundayHours: ScheduledHours.sundayHours,
            mondayHours: ScheduledHours.mondayHours,
            tuesdayHours: ScheduledHours.tuesdayHours,
            wednesdayHours: ScheduledHours.wednesdayHours,
            thursdayHours: ScheduledHours.thursdayHours,
            fridayHours: ScheduledHours.fridayHours,
            saturdayHours: ScheduledHours.saturdayHours,
          })
          .from(ScheduledHours)
          .where(eq(ScheduledHours.localeId, localeId))
      )[0] as Hours;
      return { result, status: 200 };
    }
    if (index === 3) {
      result = (
        await db
          .select({
            about: Locales.about,
            observation: Locales.observation,
            phoneNumber: Locales.phoneNumber,
            type: Locales.type,
          })
          .from(Locales)
          .where(eq(Locales.id, localeId))
      )[0] as MoreInfo;

      if (result && [0, 5, 6, 7].includes(result.type)) {
        const tableName = getTableName(result.type);

        result = {
          ...result,
          ...(
            await db
              .select()
              .from(tableName)
              .where(eq(tableName.localeId, localeId))
          )[0],
        };
      }

      return { result, status: 200 };
    }
    if (index === 4) {
      result = (
        await db.execute(sql`
        SELECT 
          locale.id,
          locale.name,
          locale.address,
          locale.localizationLink,
          locale.latitude,
          locale.longitude,
          locale.accessibility,
          locale.about,
          locale.phoneNumber,
          locale.type,
          locale.observation,
          json_arrayagg(json_object('id', photo.id, 'name', photo.name, 'url', photo.url)) as photos,
          locale.grade,
          CASE WHEN favorite.localeId = locale.id AND favorite.userId = ${userId} THEN true ELSE false END as favorite
        FROM 
          Locales AS locale
        LEFT JOIN
          Photos AS photo ON locale.id = photo.localeId
        LEFT JOIN
          Favorites AS favorite ON locale.id = favorite.localeId AND favorite.userId = ${userId}
        WHERE
          locale.id = ${localeId}
        `)
      )[0] as unknown as Localization[];

      result[0].schedule = (
        await db
          .select({
            sundayHours: ScheduledHours.sundayHours,
            mondayHours: ScheduledHours.mondayHours,
            tuesdayHours: ScheduledHours.tuesdayHours,
            wednesdayHours: ScheduledHours.wednesdayHours,
            thursdayHours: ScheduledHours.thursdayHours,
            fridayHours: ScheduledHours.fridayHours,
            saturdayHours: ScheduledHours.saturdayHours,
          })
          .from(ScheduledHours)
          .where(eq(ScheduledHours.localeId, localeId))
      )[0] as Hours;

      if ([0, 5, 6, 7].includes(result[0].type as number)) {
        const tableName = getTableName(result[0].type as number);

        result[0].specialInfo = (
          await db
            .select()
            .from(tableName)
            .where(eq(tableName.localeId, localeId))
        )[0] as unknown as MoreInfo;
      }

      if (result[0].photos.length === 1 && result[0].photos[0].id === null) {
        result[0].photos = [];
      }

      return { result: result[0], status: 200 };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: "Unexpected error", status: 500 };
  }
};

export default listSectionService;
