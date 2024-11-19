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
import { eq } from "drizzle-orm";
import type { ResultAction } from "./createOrUpdateReviewService";
import { scheduleAttributes } from "./showLocalesService";
import type { Hours } from "./listSectionService";
import fs from "node:fs";

type Photo = {
  id?: number;
  name?: string;
  data?: string;
};
export type EditLocale = {
  name?: string;
  localizationLink?: string;
  latitude?: string;
  longitude?: string;
  address?: string;
  about?: string;
  observation?: string;
  type?: number;
  phoneNumber?: string;
  accessibility?: number;
  updatedAt: Date;
  photos?: Array<Photo>;
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
type ResultObject = {
  basicInfo: string;
  photos: string;
  schedule: string;
  specialInfo: string;
};

export type EditResult = {
  result?: ResultObject | string | undefined;
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
  specialInfo: EditLocale["specialInfo"],
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

const updateLocaleService = async (
  locale: EditLocale,
  localeId: number,
): Promise<EditResult> => {
  const db = await getDbConnection();
  const { photos, schedule, specialInfo, ...basicLocaleInfo } = locale;
  const date = new Date();
  let basicInfoResult: ResultAction;
  let scheduleResult: ResultAction;
  let specialInfoResult: ResultAction | undefined;
  let photosInfoResult: ResultAction;

  try {
    // check if every information needed is here or not.
    // await dbConnection
    const localeRow = (
      await db.select().from(Locales).where(eq(Locales.id, localeId))
    )[0];
    const result: ResultObject = {} as ResultObject;

    if (localeRow) {
      if (basicLocaleInfo) {
        try {
          basicLocaleInfo.name = basicLocaleInfo.name || localeRow.name;
          basicLocaleInfo.address =
            basicLocaleInfo.address || localeRow.address;
          basicLocaleInfo.type =
            typeof basicLocaleInfo.type === "number"
              ? basicLocaleInfo.type
              : localeRow.type;
          basicLocaleInfo.localizationLink =
            basicLocaleInfo.localizationLink || localeRow.localizationLink;

          basicInfoResult = (
            await db
              .update(Locales)
              .set({ ...basicLocaleInfo, updatedAt: date })
              .where(eq(Locales.id, localeId))
          )[0];
          if (
            "affectedRows" in basicInfoResult &&
            basicInfoResult.affectedRows === 1
          ) {
            result.basicInfo = "updated";
          } else {
            result.basicInfo = "failed to update";
          }
        } catch (error) {
          console.log(error);
          result.basicInfo = "failed to update";
        }
      }
      if (photos) {
        // search and add photos
        try {
          const currentLocalePhotosIds: Photo[] = await db
            .select({ id: Photos.id })
            .from(Photos)
            .where(eq(Photos.localeId, localeId));
          if (currentLocalePhotosIds?.length > 0) {
            for (const photoId of currentLocalePhotosIds) {
              if (photos.findIndex((photo) => photo.id === photoId.id) === -1) {
                await db.delete(Photos).where(eq(Photos.id, photoId.id || 0));
              }
            }
          }

          for (const photo of photos) {
            try {
              if (photo.id) {
                continue;
              }
              if (photo.data) {
                const newPhotoUrl = `/public/${date.getTime()}_${photo.name}`;
                fs.writeFileSync(`.${newPhotoUrl}`, photo.data, {
                  encoding: "base64",
                });

                const photoId = (
                  await db
                    .insert(Photos)
                    .values({
                      localeId: localeId,
                      name: photo?.name || "photo",
                      url: newPhotoUrl,
                      createdAt: date,
                      updatedAt: date,
                    })
                    .$returningId()
                )[0];
              }
            } catch (err) {
              result.photos = "failed to update";
            }
          }
          result.photos = "updated";
        } catch (err) {
          if (err) {
            result.photos = "failed to update";
          }
        }
      }
      if (schedule) {
        try {
          const doesScheduleExist = (
            await db
              .select()
              .from(ScheduledHours)
              .where(eq(ScheduledHours.localeId, localeId))
          )[0];
          if (doesScheduleExist) {
            const scheduleRow = {
              ...Object.entries(schedule).reduce((acc, [key, value]) => {
                if (value) {
                  const x = scheduleAttributes.find((attribute) =>
                    attribute.includes(key),
                  ) as string;
                  if (x) {
                    (acc as Hours)[x as keyof Hours] = value;
                  }
                }
                return acc;
              }, {}),
            };

            scheduleResult = (
              await db
                .update(ScheduledHours)
                .set({ localeId: localeId, ...scheduleRow, updatedAt: date })
                .where(eq(ScheduledHours.localeId, localeId))
            )[0];
          } else {
            scheduleResult = (
              await db.insert(ScheduledHours).values({
                localeId: localeId,
                mondayHours: schedule.monday || "",
                tuesdayHours: schedule.tuesday || "",
                wednesdayHours: schedule.wednesday || "",
                thursdayHours: schedule.thursday || "",
                fridayHours: schedule.friday || "",
                saturdayHours: schedule.saturday || "",
                sundayHours: schedule.sunday || "",
                createdAt: date,
                updatedAt: date,
              })
            )[0];
          }
          if (
            "affectedRows" in scheduleResult &&
            scheduleResult.affectedRows === 1
          ) {
            result.schedule = "updated";
          } else {
            result.schedule = "failed to update";
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (specialInfo) {
        if (
          typeof basicLocaleInfo?.type === "number" &&
          localeRow.type !== basicLocaleInfo.type &&
          [0, 5, 6, 7].includes(localeRow.type)
        ) {
          const { tableName } = getSpecialInfo(
            localeRow.type,
            specialInfo,
            localeId,
          );
          try {
            specialInfoResult = (
              await db.delete(tableName).where(eq(tableName.localeId, localeId))
            )[0];
          } catch (error) {
            console.log(error);
          }
        }
        if (
          (typeof basicLocaleInfo?.type === "number" &&
            [0, 5, 6, 7].includes(basicLocaleInfo.type)) ||
          (typeof basicLocaleInfo?.type !== "number" &&
            [0, 5, 6, 7].includes(localeRow.type))
        ) {
          const localeType =
            typeof basicLocaleInfo?.type !== "number"
              ? localeRow.type
              : basicLocaleInfo.type;

          const { tableName, specialInfo: newSpecialInfo } = getSpecialInfo(
            localeType,
            specialInfo,
            localeId,
          );

          try {
            const doesSpecialInfoExist = await db
              .select()
              .from(tableName)
              .where(eq(tableName.localeId, localeId));

            if (doesSpecialInfoExist.length > 0) {
              specialInfoResult = (
                await db
                  .update(tableName)
                  .set({ ...newSpecialInfo, updatedAt: date })
                  .where(eq(tableName.localeId, localeId))
              )[0];
            } else {
              specialInfoResult = (
                await db.insert(tableName).values({
                  ...newSpecialInfo,
                  createdAt: date,
                  updatedAt: date,
                })
              )[0];
            }
          } catch (error) {
            result.specialInfo = "failed to update";
          }
        }
        if (
          specialInfoResult &&
          "affectedRows" in specialInfoResult &&
          specialInfoResult.affectedRows === 1
        ) {
          result.specialInfo = "updated";
        } else {
          result.specialInfo = "failed to update";
        }
      }
      if (Object.entries(result).length > 0) {
        const entries = Object.entries(result);
        let failedUpates = 0;

        for (const [key, value] of entries) {
          if (value === "failed to update") {
            failedUpates++;
          }
        }
        if (failedUpates === 0 || failedUpates < entries.length) {
          return { result: result, status: 200 };
        }
        return {
          error: "failed to update due to internal server error",
          status: 500,
        };
      }
    }
    return { result: "Locale not found", status: 401 };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: "Internal server error", status: 500 };
  }
};

export default updateLocaleService;
