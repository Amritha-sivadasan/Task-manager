import jwt, { JwtPayload } from "jsonwebtoken";

export const tokenCreation = (userId: string) => {
  const token = jwt.sign({ id: userId }, process.env.JWTSECRET!, {
    expiresIn: "1h",
  });
  return token;
};

export const validateToken = (token: string) => {
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET!) as JwtPayload;
    return decode;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
