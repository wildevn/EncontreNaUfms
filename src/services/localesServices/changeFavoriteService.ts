import { db } from "@database/db";
import { Favorites } from "@database/schema";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";

type Favorite = {
  localeId: number;
  userId: number;
};

type ResultAction = {
  affectedRows: number;
};

export type FavoriteReply = {
  result?: string;
  error?: string;
  status: number;
};
const changeFavoriteService = async (localeId: number, userId: number) => {
  const dbConnection = await db();
  let result: ResultAction | undefined;

  try {
    const locale: Favorite = (
      await dbConnection
        .select({
          localeId: Favorites.localeId,
          userId: Favorites.userId,
        })
        .from(Favorites)
        .where(
          and(eq(Favorites.localeId, localeId), eq(Favorites.userId, userId)),
        )
    )[0] as Favorite;

    if (locale) {
      result = (
        await dbConnection
          .delete(Favorites)
          .where(
            and(eq(Favorites.localeId, localeId), eq(Favorites.userId, userId)),
          )
      )[0] as ResultAction;
    } else {
      const date = new Date();
      result = (
        await dbConnection.insert(Favorites).values({
          localeId: localeId,
          userId: userId,
          createdAt: date,
          updatedAt: date,
        })
      )[0] as ResultAction;
    }
    if (result) {
      return { result: "Favorite changed", status: 200 };
    }
    return {
      error: "Favorite not changed due to internal server error",
      status: 500,
    };
  } catch (error) {
    return { error: error, status: 500 };
  }
};

export default changeFavoriteService;
