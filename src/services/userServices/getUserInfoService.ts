// Responsible to return user information
import { getDbConnection } from "@database/db";
import { Users } from "@database/schema";
import { eq } from "drizzle-orm";

type User = {
  name: string;
  email: string;
  id?: number;
};

type UserReply = {
  user?: User;
  error?: string;
  status: number;
};
const getUserInfoService = async (email: string): Promise<UserReply> => {
  const db = await getDbConnection();
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
  return { user: user, status: 200 };
};

export default getUserInfoService;
