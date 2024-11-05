import { getDbConnection } from "@/models/db";
import {
  AcademicBlocks,
  Libraries,
  Locales,
  Photos,
  ScheduledHours,
  Sports,
  Transports,
} from "@/models/schema";
import type { ResultAction } from "./createOrUpdateReviewService";

export type Locale = {
  name: string;
  localizationLink: string;
  latitude: string;
  longitude: string;
  address: string;
  about?: string;
  observation?: string;
  type: number;
  phoneNumber?: string;
  accessibility?: number;
  createdAt: Date;
  updatedAt: Date;
  photos?: Array<{
    name: string;
    url: string;
  }>;
  schedule?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  specialInfo?: {
    course?: string;
    libraryLink?: string;
    availableSports?: string;
    availableBuses?: string;
    rules?: string;
  };
};

type GeneralInfo = {
  localeId: number;
  createdAt: Date;
  updatedAt: Date;
};

// type BasicLocaleInfo = Omit<Locale, "photos" | "schedule" | "specialInfo">;
type GetSpecialInfo = {
  tableName:
    | typeof AcademicBlocks
    | typeof Libraries
    | typeof Sports
    | typeof Transports;
  specialInfo: GeneralInfo &
    (
      | {
          course: string;
        }
      | {
          libraryLink: string;
          rules: string;
        }
      | {
          rules: string;
          availableSports: string;
        }
      | {
          availableBuses: string;
        }
    );
};

export type Result = {
  result?: string;
  error?: string;
  status: number;
};

// const LocaleTypes: Array<string> = [
//   "academicblocks", // 0
//   "touristspoints", // 1
//   "banks", // 2
//   "restaurants", // 3
//   "healthservices", // 4
//   "libraries", // 5
//   "sportscenters", // 6
//   "transports", // 7
//   "parkinglots", // 8
//   "generalbuildings", // 9
// ];

const getSpecialInfo = (
  type: number,
  specialInfo: Locale["specialInfo"],
  localeId: number,
): GetSpecialInfo => {
  const date = new Date();
  const generalInfo: GeneralInfo = {
    localeId,
    createdAt: date,
    updatedAt: date,
  };

  switch (type) {
    case 0:
      return {
        tableName: AcademicBlocks,
        specialInfo: {
          ...generalInfo,
          course: specialInfo?.course ? specialInfo.course : "",
        },
      };
    case 5:
      return {
        tableName: Libraries,
        specialInfo: {
          ...generalInfo,
          libraryLink: specialInfo?.libraryLink ? specialInfo.libraryLink : "",
          rules: specialInfo?.rules ? specialInfo.rules : "",
        },
      };
    case 6:
      return {
        tableName: Sports,
        specialInfo: {
          ...generalInfo,
          availableSports: specialInfo?.availableSports
            ? specialInfo.availableSports
            : "",
          rules: specialInfo?.rules ? specialInfo.rules : "",
        },
      };
    case 7:
      return {
        tableName: Transports,
        specialInfo: {
          ...generalInfo,
          availableBuses: specialInfo?.availableBuses
            ? specialInfo.availableBuses
            : "",
        },
      };
    default:
      return {
        tableName: AcademicBlocks,
        specialInfo: {
          ...generalInfo,
          course: specialInfo?.course ? specialInfo.course : "",
        },
      };
  }
};

const createLocaleService = async (locale: Locale): Promise<Result> => {
  const db = await getDbConnection();
  const { photos, schedule, specialInfo, ...basicLocaleInfo } = locale;
  const date = new Date();
  let result: { id: number } | undefined | ResultAction;

  try {
    // check if every information needed is here or not.
    basicLocaleInfo.localizationLink = basicLocaleInfo.localizationLink || "";
    basicLocaleInfo.latitude = basicLocaleInfo.latitude || "0.0";
    basicLocaleInfo.longitude = basicLocaleInfo.longitude || "0.0";
    basicLocaleInfo.createdAt = date;
    basicLocaleInfo.updatedAt = date;

    result = (
      await db.insert(Locales).values(basicLocaleInfo).$returningId()
    )[0];

    if (result && "id" in result) {
      if (photos) {
        for (const photo of photos) {
          try {
            const photoId = (
              await db
                .insert(Photos)
                .values({
                  localeId: result.id,
                  name: photo.name,
                  url: photo.url,
                  createdAt: date,
                  updatedAt: date,
                })
                .$returningId()
            )[0];
          } catch (error) {
            console.log(error);
          }
        }
      }
      if (schedule) {
        try {
          await db.insert(ScheduledHours).values({
            localeId: result.id,
            mondayHours: schedule.monday || "",
            tuesdayHours: schedule.tuesday || "",
            wednesdayHours: schedule.wednesday || "",
            thursdayHours: schedule.thursday || "",
            fridayHours: schedule.friday || "",
            saturdayHours: schedule.saturday || "",
            sundayHours: schedule.sunday || "",
            createdAt: date,
            updatedAt: date,
          });
        } catch (error) {
          console.log(error);
        }
      }
      if (specialInfo) {
        if ([0, 5, 6, 7].includes(basicLocaleInfo.type)) {
          const { tableName, specialInfo: newSpecialInfo } = getSpecialInfo(
            basicLocaleInfo.type,
            specialInfo,
            result.id,
          );
          try {
            await db.insert(tableName).values(newSpecialInfo);
          } catch (error) {
            console.log(error);
          }
        }
      }
      return { result: "Locale created", status: 201 };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
  }
  return { error: "Internal server error", status: 500 };
};

export default createLocaleService;
