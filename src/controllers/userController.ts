import { User } from "../model/userModel"
import { NextFunction, Request, Response } from "express"
import { generateAccessToken } from "../utils/tokenGeneration"
import bcrypt from "bcryptjs"
import { mailerSender } from "../utils/sendEmail" 

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

// Generate OTP and send email
export const sendPasswordResetOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        // Generate 6-digit OTP
        const generateOTP = (): string => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };
        
        const otp = generateOTP();

        // Save OTP and expiry (10 minutes)
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = new Date(Date.now() + 600000); // 10 minutes
        await user.save();

        // Send email with OTP
        await mailerSender(
            email,
            'Password Reset OTP',
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset OTP</h2>
                    <p>Hello ${user.username},</p>
                    <p>Your OTP for password reset is:</p>
                    <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px; color: #007bff;">${otp}</h1>
                    <p><strong>This OTP will expire in 10 minutes.</strong></p>
                    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                </div>
            `
        );

        return res.status(200).json({ 
            message: 'OTP has been sent to your email.',
            email: email 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending OTP', error });
    }
};
// Verify OTP and reset password
export const resetPasswordWithOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        // Find user with valid OTP
        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error resetting password', error });
    }
};