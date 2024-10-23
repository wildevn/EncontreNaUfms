import { db } from "@/models/db";
import { Users } from "@/models/schema";
import { eq } from "drizzle-orm";
import type { Result } from "../localesServices/createLocaleService";
import type { ResultAction } from "../localesServices/createOrUpdateReviewService";

const deleteUserService = async (email: string): Promise<Result> => {
  const dbConnection = await db();

  try {
    const result = (
      await dbConnection.delete(Users).where(eq(Users.email, email))
    )[0] as ResultAction;

    if ("affectedRows" in result && result.affectedRows === 1) {
      return {
        status: 200,
        result: "User deleted successfully",
      };
    }
    return { error: "User not found", status: 404 };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};

export default deleteUserService;
