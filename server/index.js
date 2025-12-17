import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// === LOAD .env FIRST ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Debug
console.log('========== ENVIRONMENT CHECK ==========');
console.log('PAYSTACK_SECRET_KEY loaded:', !!process.env.PAYSTACK_SECRET_KEY);
console.log('Key (first 10 chars):', process.env.PAYSTACK_SECRET_KEY?.substring(0, 10) + '...');
console.log('=======================================');

// === NOW import paystackRoutes AFTER .env is loaded ===
import paystackRoutes from './paystack.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/paystack', paystackRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});