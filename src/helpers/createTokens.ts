import type { User } from "@services/userServices/createOrUpdateUserService";
import { sign } from "jsonwebtoken";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const createTokens = (user: User): Tokens => {
  const accessToken: string = sign(user, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRATION as string,
  });
  const refreshToken: string = sign(
    user,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION as string,
    },
  );

  return { accessToken, refreshToken };
};

export default createTokens;
