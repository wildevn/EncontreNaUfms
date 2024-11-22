import { getDbConnection } from "@/models/db";
import { Histories } from "@/models/schema";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";

const deleteOldestHitoryLocaleService = async (
  userId: number,
  localeId: number,
) => {
  const db = await getDbConnection();
  const date = new Date();
  // console.log("userId: ", userId);
  // console.log("localeId: ", localeId);

  const viewdLocales = await db
    .select()
    .from(Histories)
    .where(eq(Histories.userId, userId));
  // console.log("\n\n, viewdLocales: ", viewdLocales);

  if (viewdLocales.length >= 2) {
    const localeIdToDelete = viewdLocales.sort((a, b) => {
      return new Date(a.updatedAt).getTime() <= new Date(b.updatedAt).getTime()
        ? -1
        : 1;
    })[0].localeId;

    // console.log("\n\n\nlocaleId: ", localeIdToDelete);

    await db
      .delete(Histories)
      .where(
        and(
          eq(Histories.userId, userId),
          eq(Histories.localeId, localeIdToDelete),
        ),
      );
  }

  const alreadyVisited: boolean =
    viewdLocales.length > 0 &&
    viewdLocales.findIndex((locale) => locale.localeId === localeId) >= 0;

  // console.log("alreadyVisited: ", alreadyVisited);
  if (alreadyVisited) {
    await db
      .update(Histories)
      .set({ updatedAt: date })
      .where(
        and(eq(Histories.userId, userId), eq(Histories.localeId, localeId)),
      );
  } else {
    await db.insert(Histories).values({
      userId: userId,
      localeId: localeId,
      createdAt: date,
      updatedAt: date,
    });
  }
};

export default deleteOldestHitoryLocaleService;
