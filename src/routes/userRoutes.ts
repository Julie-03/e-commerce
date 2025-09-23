import { signin } from "../controllers/userController";
import { login } from "../controllers/userController";
import { getAllUsers } from "../controllers/userController";
import express from "express";
const userRouter=express.Router();
userRouter.post("/userRegistration", signin);
userRouter.post("/login", login);
userRouter.get("/users", getAllUsers);
userRouter.get("/test", (req, res) => {
    res.json({ message: "Router is working!" });
});

export default userRouter;