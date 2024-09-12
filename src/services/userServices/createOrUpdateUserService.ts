// Responsible to search if the user is already regi

import { db } from "@/db";
import { Users } from "@database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export type User = {
  name: string;
  email: string;
  id?: number;
};

export type UserReply = {
  data?: User;
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
        return {
          data: {
            id: userId,
            name,
            email,
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
  return {
    data: {
      id: newUser.id,
      name,
      email,
    },
    status: 201,
  };
};

export default createOrUpdateUserService;
