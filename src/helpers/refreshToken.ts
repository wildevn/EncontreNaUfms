import type { User } from "@/services/userServices/createOrUpdateUserService";
import { db } from "@database/db";
import { Users } from "@database/schema";
import { eq } from "drizzle-orm";
import { decode, sign, type JwtPayload } from "jsonwebtoken";

interface DecodedToken {
  id: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export type NewTokenReply = {
  token?: string;
  error?: string;
  status?: number;
};

const refreshToken = async (token: string): Promise<NewTokenReply> => {
  const dbConnection = await db();
  const decodedToken: DecodedToken | string | JwtPayload | null = decode(token);

  if (
    decodedToken &&
    typeof decodedToken === "object" &&
    "id" in decodedToken
  ) {
    const user = (
      await dbConnection
        .select({
          id: Users.id,
          name: Users.name,
          email: Users.email,
        })
        .from(Users)
        .where(eq(Users.id, decodedToken.id))
    )[0] as User;

    if (user) {
      const accessToken: string = sign(user, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRATION as string,
      });
      return { token: accessToken };
    }
    return { error: "User not found", status: 404 };
  }
  return { error: "Internal Error", status: 500 };
};

export default refreshToken;
