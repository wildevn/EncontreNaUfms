import { db } from "@/models/db";
import { Reviews } from "@/models/schema";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";

type Review = {
  userId: number;
  localeId: number;
  grade: string;
};

type ResultReply = {
  result?: Review;
  error?: string;
  status: number;
};

const getReviewService = async (
  localeId: number,
  userId: number,
): Promise<ResultReply> => {
  const dbConnection = await db();
  try {
    const review: Review = (
      await dbConnection
        .select({
          userId: Reviews.userId,
          localeId: Reviews.localeId,
          grade: Reviews.grade,
        })
        .from(Reviews)
        .where(and(eq(Reviews.userId, userId), eq(Reviews.localeId, localeId)))
    )[0] as Review;
    if (!review) {
      return { error: "No review found for this user and Locale", status: 404 };
    }
    return { result: review, status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: "Unexpected error", status: 500 };
  }
};

export default getReviewService;
