import { verify } from "jsonwebtoken";

const verifyToken = (token: string, type: string): boolean => {
  const secret: string = (
    type === "access" ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET
  ) as string;
  try {
    const verfication = verify(token, secret);
    return !!verfication;
  } catch (error) {
    return false;
  }
};

export default verifyToken;
