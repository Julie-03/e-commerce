import { User } from "../model/userModel"
import { NextFunction, Request, Response } from "express"
import { generateAccessToken } from "../utils/tokenGeneration"
import bcrypt from "bcryptjs"

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, username, userRole } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
       
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            userRole: userRole || 'user' 
        });
    
        const token = generateAccessToken(newUser);
        newUser.accessToken = token;
        await newUser.save();
        
        return res.status(201).json({
            message: "User created successfully", 
            token,   
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email 
            }
        });
    } catch (error) {
        return res.status(400).json({ message: "Error in user signin", error });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "User not found, please register" });
        } 
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = generateAccessToken(user);
        
        user.accessToken = token;
        await user.save();

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                userRole: user.userRole, 
            },
        });
    } catch (error) {
        return res.status(400).json({ message: "Error in login", error });
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}, { password: 0, accessToken: 0 });
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error });
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, { password: 0, accessToken: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ message: "Error fetching user", error });
    }
}