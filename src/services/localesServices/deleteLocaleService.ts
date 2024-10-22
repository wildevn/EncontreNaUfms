import { db } from "@/models/db";
import { Locales } from "@/models/schema";
import { eq } from "drizzle-orm";
import type { Result } from "@/services/localesServices/createLocaleService";
import type { ResultAction } from "./createOrUpdateReviewService";

const deleteLocaleService = async (localeId: number): Promise<Result> => {
  try {
    const dbConnection = await db();
    const result = (
      await dbConnection.delete(Locales).where(eq(Locales.id, localeId))
    )[0] as ResultAction;

    if (result && "affectedRows" in result && result.affectedRows === 1) {
      return {
        status: 200,
        result: "Locale deleted successfully",
      };
    }
    return { error: "Locale not found", status: 404 };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};

export default deleteLocaleService;
