import { db } from "@/models/db";
import { Reviews } from "@/models/schema";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";

type Review = {
  userId: number;
  localeId: number;
  grade?: number;
};

export type ResultAction = {
  affectedRows: number;
};

type ResultReply = {
  result?: string;
  error?: string;
  status: number;
};

const createOrUpdateReviewService = async (
  localeId: number,
  userId: number,
  grade: string,
): Promise<ResultReply> => {
  const dbConnection = await db();
  try {
    const date = new Date();
    let result: ResultAction | undefined;
    const review = (
      await dbConnection
        .select({
          userId: Reviews.userId,
          localeId: Reviews.localeId,
        })
        .from(Reviews)
        .where(and(eq(Reviews.userId, userId), eq(Reviews.localeId, localeId)))
    )[0] as Review;

    if (review) {
      result = (
        await dbConnection
          .update(Reviews)
          .set({ grade, updatedAt: date })
          .where(
            and(eq(Reviews.userId, userId), eq(Reviews.localeId, localeId)),
          )
      )[0] as ResultAction;
    } else {
      result = (
        await dbConnection.insert(Reviews).values({
          userId,
          localeId,
          grade,
          createdAt: date,
          updatedAt: date,
        })
      )[0] as ResultAction;
    }

    if ("affectedRows" in result) {
      return {
        result: review ? "Updated review" : "Created review",
        status: review ? 200 : 201,
      };
    }

    return {
      error: "Internal server error, review not created nor updated",
      status: 500,
    };
  } catch (error) {
    return { error: error as string, status: 500 };
  }
};

export default createOrUpdateReviewService;
