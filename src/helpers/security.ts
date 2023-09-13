import crypto from "crypto";
import jwt from "jsonwebtoken";

export function hash(string: string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

export function createToken(email: string) {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is missing or undefined.");
  }
  return jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "1d" });
}
