// Responsible to return user information
import { db } from "@/db";
import { Users } from "@database/schema";
import { eq } from "drizzle-orm";

type User = {
  name: string;
  email: string;
  id?: number;
};

type UserReply = {
  data?: User;
  error?: string;
  status: number;
};
const getUserInfoService = async (userId: number): Promise<UserReply> => {
  const dbConnection = await db();
  const user: User = (
    await dbConnection
      .select({
        id: Users.id,
        name: Users.name,
        email: Users.email,
      })
      .from(Users)
      .where(eq(Users.id, userId))
  )[0] as User;
  if (!user) {
    return { error: "User not found", status: 404 };
  }
  return { data: user, status: 200 };
};

export default getUserInfoService;
