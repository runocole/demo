import express from 'express';
import axios from 'axios';

const router = express.Router();

// ============================================
// CONFIGURATION - USING .env FILE
// ============================================
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://oticgs.com';

// Log configuration status
console.log('🔧 Paystack Configuration:');
console.log('   Environment:', process.env.NODE_ENV || 'development');
console.log('   Frontend URL:', FRONTEND_URL);
console.log('   Paystack Key Present:', !!PAYSTACK_SECRET_KEY);

// ============================================
// 1. INITIALIZE PAYMENT ROUTE
// ============================================
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, orderNumber, metadata } = req.body;
    
    // Basic validation
    if (!email || !amount || !orderNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, amount, and order number are required' 
      });
    }
    
    console.log(`💰 Payment initialized: ${email} - ${amount} - ${orderNumber}`);
    
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount,
        reference: orderNumber,
        metadata,
        callback_url: `${FRONTEND_URL}/order-confirmation`
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code
    });
    
  } catch (error) {
    console.error('❌ Paystack Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      error: 'Payment failed to initialize',
      details: error.response?.data?.message || error.message 
    });
  }
});

// ============================================
// 2. VERIFY PAYMENT ROUTE
// ============================================
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
    
    res.json({ 
      success: true, 
      data: response.data.data 
    });
    
  } catch (error) {
    console.error('❌ Verification Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Verification failed' 
    });
  }
});

export default router;