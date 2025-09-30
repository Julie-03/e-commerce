import { time, timeStamp } from 'console';
import {Document, model, Schema} from 'mongoose';
export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    message: string;
}

const contactSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: false},
    message: {type: String, required: true},
}, {
  timestamps: true
});

export const Contact = model<IContact>('Contact', contactSchema);
