import express from 'express';
import axios from 'axios';

const router = express.Router();

// === TEMPORARY HARDCODE - REMOVE AFTER TESTING ===
const PAYSTACK_SECRET_KEY = "sk_test_99c58cbc267e7ded6f92028c7e901e0f9dfead38";
// === END TEMPORARY ===

console.log('Paystack.js - Key hardcoded:', PAYSTACK_SECRET_KEY.substring(0, 10) + '...');

// Initialize payment
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, orderNumber, metadata } = req.body;
    
    console.log('Initializing payment for:', email, 'Amount:', amount);
    
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount, 
        reference: orderNumber,
        metadata,
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-confirmation`
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Paystack response successful');
    res.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code
    });
  } catch (error) {
    console.error('Paystack API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Payment initialization failed',
      details: error.response?.data?.message || error.message 
    });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    res.json({ data: response.data.data });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;