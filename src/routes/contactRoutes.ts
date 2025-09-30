// src/routes/contactRoutes.ts
import { Router } from 'express';
import { createContact } from '../controllers/ContactController';

const router = Router();

// POST /api/contacts  → will hit your createContact controller
router.post('/', createContact);

export default router;