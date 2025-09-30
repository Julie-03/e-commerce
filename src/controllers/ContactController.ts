// src/controllers/contactController.ts
import { Request, Response } from 'express';
import { Contact } from '../model/contactModel';
import { mailerSender } from '../utils/sendEmail';
import dotenv from 'dotenv';

dotenv.config();

// Create a new contact message
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ message: 'Name, email, and message are required.' });
      return;
    }

    // Save contact in DB
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });
    await newContact.save();

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await mailerSender(
        adminEmail,
        'New Contact Message Received',
        `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      );
    }

    res.status(201).json({
      message: 'Contact message saved successfully.',
      contact: newContact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};