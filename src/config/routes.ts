import express from 'express';
import * as client from '../controllers/clientController';

const router = express.Router();

// Login
router.post('/elegibilidade', client.elegibilidade)

export { router as appRouter }