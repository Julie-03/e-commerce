import {Schema, Document, model} from "mongoose"

export interface Iuser extends Document{
    username: string;
    email: string;
    password: string;
    accessToken: string;
    userRole: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const userSchema = new Schema<Iuser>({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    accessToken: {type: String},
    userRole: {enum: ['user', 'admin'], default: 'user', type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
}, {timestamps: true})

export const User = model<Iuser>("User", userSchema)