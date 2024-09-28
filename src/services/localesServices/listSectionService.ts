import { db } from "@/models/db";
import { Favorites, Locales, Photos } from "@/models/schema";
import { and } from "drizzle-orm";
import { eq, sql } from "drizzle-orm";

const LocaleSections: Array<string> = [
  "localization", // 0
  "hours", // 1
  "moreinfo", // 2
];

// const subquery = db.select({
//   localeId: photos.localeId,
//   photoArray: sql`json_arrayagg(json_object('id', ${photos.id}, 'data', ${photos.data}))`
// })
// .from(photos)
// .groupBy(photos.localeId)
// .as('photoSubquery');

// const result = await db.select({
//   id: locales.id,
//   name: locales.name,
//   address: locales.address,
//   photos: subquery.photoArray
// })
// .from(locales)
// .leftJoin(subquery, eq(locales.id, subquery.localeId));

const listSectionService = async (
  localeId: number,
  userId: number,
  sectionId: number | string,
) => {
  let result: any;
  const dbConnection = await db();
  const index: number =
    typeof sectionId === "string"
      ? LocaleSections.indexOf(sectionId.toLowerCase())
      : sectionId;

  if (index === -1) {
    return { error: "Section not found", status: 404 };
  }

  try {
    if (index === 0) {
      const subquery = await dbConnection.execute(sql`
        SELECT 
          locale.id,
          locale.name,
          locale.address,
          locale.localizationLink,
          json_arrayagg(json_object('id', photo.id, 'name', photo.name, 'data', photo.data)) as photos,
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
        `);

      console.log(subquery);
      return { result: subquery[0] };
      // result = (
      //   await dbConnection
      //     .select({
      //       id: Locales.id,
      //       name: Locales.name,
      //       address: Locales.address,
      //       localizationLink: Locales.localizationLink,
      //       photos: subquery.photosArray,
      //       // favorite: sql`CASE WHEN ${Favorites.localeId} = ${Locales.id} AND ${Favorites.userId} = ${userId} THEN true ELSE false END`,
      //       grade: Locales.grade,
      //     })
      //     .from(Locales)
      //     .leftJoin(subquery.photoSubquery, eq(Locales.id, subquery.localeId))
      // )[0];
      // .leftJoin(
      //   Favorites,
      //   and(
      //     eq(Favorites.localeId, Locales.id),
      //     eq(Favorites.userId, userId),
      //   ),
      // )
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: "Unexpected error", status: 500 };
  }
};

export default listSectionService;
