import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Iuser } from "../model/userModel";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET
export const generateAccessToken = (user: Iuser): string => {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    { 
      _id: user._id, 
      email: user.email, 
      role: user.userRole   
    },
    jwtSecret,
    { expiresIn: "7h" }
  );
};
