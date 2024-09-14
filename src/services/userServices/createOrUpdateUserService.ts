// Responsible to search if the user is already regi

import { db } from "@/db";
import { Users } from "@database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import createTokens from "@/helpers/createTokens";

export type User = {
  name: string;
  email: string;
  id?: number;
  token?: string;
  refreshToken?: string;
};

export type UserReply = {
  user?: User;
  error?: string;
  status: number;
};

export type ErrorType = {
  error: string;
};

const hashPassword = async (
  password: string,
): Promise<string | { error: string }> => {
  const saltRounds = 8;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    return { error: (error as { message: string }).message };
  }
};

const createOrUpdateUserService = async (
  name: string,
  email: string,
  password: string,
  userId?: number,
): Promise<UserReply> => {
  const dbConnection = await db();

  const user = userId
    ? ((
        await dbConnection
          .select({
            id: Users.id,
            name: Users.name,
            email: Users.email,
          })
          .from(Users)
          .where(eq(Users.id, userId))
      )[0] as User)
    : ((
        await dbConnection
          .select({
            id: Users.id,
            name: Users.name,
            email: Users.email,
          })
          .from(Users)
          .where(eq(Users.email, email))
      )[0] as User);

  if (userId) {
    if (!user) {
      return { error: "User not found", status: 404 };
    }

    const hashedPassword = await hashPassword(password);
    if (typeof hashedPassword === "object") {
      return { error: hashedPassword.error, status: 400 };
    }

    const result: { info?: string } = (
      await dbConnection
        .update(Users)
        .set({ name, email, password: hashedPassword })
        .where(eq(Users.id, userId))
    )[0];

    if (result?.info) {
      if (result.info.includes("Changed: 1")) {
        const tokens = createTokens({ id: userId, name, email });

        return {
          user: {
            id: userId,
            name,
            email,
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          status: 200,
        };
      }
      return { error: result.info, status: 400 };
    }
    return { error: result as string, status: 400 };
  }

  if (user) {
    return { error: "User already exists", status: 400 };
  }

  const date = new Date();
  const hashedPassword = await hashPassword(password);
  if (typeof hashedPassword === "object") {
    return { error: hashedPassword.error, status: 400 };
  }

  const newUser = (
    await dbConnection
      .insert(Users)
      .values({
        name,
        email,
        password: hashedPassword,
        createdAt: date,
        updatedAt: date,
      })
      .$returningId()
  )[0];

  if (!newUser) {
    return { error: `User not created: ${newUser}`, status: 400 };
  }
  const tokens = createTokens({ id: newUser.id, name, email });
  return {
    user: {
      id: newUser.id,
      name,
      email,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    status: 201,
  };
};

export default createOrUpdateUserService;
