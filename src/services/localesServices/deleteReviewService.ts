import { getDbConnection } from "@/models/db";
import { Reviews } from "@/models/schema";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";

type Review = {
  grade: string;
};

type ResultReply = {
  result?: string;
  error?: string;
  status: number;
};

type ResultAction = {
  affectedRows: number;
};

const deleteReviewService = async (
  localeId: number,
  userId: number,
): Promise<ResultReply> => {
  const db = await getDbConnection();

  try {
    const review: Review = (
      await db
        .select({
          grade: Reviews.grade,
        })
        .from(Reviews)
        .where(and(eq(Reviews.localeId, localeId), eq(Reviews.userId, userId)))
    )[0] as Review;

    if (!review) {
      return {
        error: "Impossible to delete, no review found for this user and Locale",
        status: 404,
      };
    }

    const result: ResultAction = (
      await db
        .delete(Reviews)
        .where(and(eq(Reviews.localeId, localeId), eq(Reviews.userId, userId)))
    )[0] as ResultAction;

    if (result.affectedRows === 0) {
      return { error: "No review found for this user and Locale", status: 404 };
    }
    return { result: "Review deleted", status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: "Unexpected error", status: 500 };
  }
};

export default deleteReviewService;
