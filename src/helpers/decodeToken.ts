import { decode } from "jsonwebtoken";
import verifyToken from "./verifyToken";

const decodeToken = (authorization: string): number => {
  if (authorization) {
    const [_, token] = authorization.split(" ");
    const isValid = verifyToken(token, "access");
    if (isValid) {
      try {
        const decodedToken = decode(token);
        if (
          decodedToken &&
          typeof decodedToken === "object" &&
          "id" in decodedToken
        ) {
          return decodedToken.id;
        }
      } catch (error) {
        return 0;
      }
    }
  }
  return 0;
};

export default decodeToken;
