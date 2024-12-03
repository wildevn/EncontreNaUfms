import type { User } from "@services/userServices/createOrUpdateUserService";
import { getDbConnection } from "@/models/db";
import { Users } from "@/models/schema";
import { eq } from "drizzle-orm";
import sendRecoveryEmail from "@/helpers/sendRecoveryEmail";
import tokenStash from "@/helpers/TokenStash";

export type Reply = {
  result?: string;
  error?: string;
  status: number;
};

const recoveryPasswordService = async (email: string): Promise<Reply> => {
  const db = await getDbConnection();

  try {
    const user: User = (
      await db
        .select({
          id: Users.id,
          name: Users.name,
          email: Users.email,
        })
        .from(Users)
        .where(eq(Users.email, email))
    )[0] as User;

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    const token: number = tokenStash.generateToken(user.email);

    const emailSent: any = await sendRecoveryEmail(user.name, email, token);

    if (emailSent instanceof Error) {
      return { error: emailSent.message, status: 500 };
    }

    if (emailSent?.response?.status >= 400) {
      return {
        error: "Error while sending the email",
        status: emailSent.response.status,
      };
    }

    return { result: "Recovery email sent", status: emailSent.response.status };
  } catch (error) {
    return { error: "Internal Server Error", status: 500 };
  }
};

export default recoveryPasswordService;
