import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/userModel";
const JWT_SECRET = process.env.JWT_SECRET ?? "";
export const requireSignin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;
        
      const verifytoken: any = jwt.verify(token, JWT_SECRET);
      
      const rootuser = await User.findOne({
        _id: verifytoken._id,  // Changed from verifytoken.id to verifytoken._id
        accessToken: token
      });
      
      if (!rootuser) {
        throw "User not found";
      }
      req.user = rootuser;
      next();
    } else {
      throw "Authentication is required";
    }
  } catch (error) {
    return res.status(400).json({ message: "Authorization required" });
  }
};