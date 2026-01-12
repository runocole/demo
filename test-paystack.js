// C:\Users\DELL\Desktop\demo\test-paystack.js
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment from .env file in project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

console.log('🔍 Testing Paystack LIVE Configuration...');
console.log('Current directory:', __dirname);

async function testPaystack() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  
  console.log('\n📊 CONFIGURATION CHECK:');
  console.log('1. Environment:', process.env.NODE_ENV || 'not set');
  console.log('2. Paystack Key:', secretKey ? '✅ Found (' + secretKey.substring(0, 8) + '...)' : '❌ NOT FOUND');
  console.log('3. Frontend URL:', process.env.FRONTEND_URL || 'not set');
  console.log('4. Port:', process.env.PORT || 'not set');
  
  if (!secretKey) {
    console.error('\n❌ ERROR: PAYSTACK_SECRET_KEY is missing from .env file');
    return;
  }
  
  try {
    console.log('\n🌐 Testing Paystack API connectivity...');
    
    // Test 1: Simple API call to verify key works
    const response = await axios.get('https://api.paystack.co/transaction/totals', {
      headers: {
        Authorization: `Bearer ${secretKey}`
      },
      timeout: 10000
    });
    
    console.log('✅ Paystack API is ACCESSIBLE');
    console.log('💰 Account Balance:', response.data.data);
    console.log('📅 Today:', new Date().toLocaleDateString());
    
    // Test 2: Try to initialize a test payment
    console.log('\n💳 Testing payment initialization...');
    
    const testRef = 'TEST-' + Date.now();
    const paymentData = {
      email: 'test@oticgs.com',
      amount: 10000, // ₦100 in kobo
      reference: testRef,
      callback_url: process.env.FRONTEND_URL + '/order-confirmation'
    };
    
    console.log('Payment data:', paymentData);
    
    const paymentResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('\n🎉 SUCCESS! Payment initialized correctly');
    console.log('Reference:', paymentResponse.data.data.reference);
    console.log('Authorization URL:', paymentResponse.data.data.authorization_url);
    console.log('\n✅ Your Paystack LIVE configuration is WORKING!');
    console.log('✅ Ready for deployment to oticgs.com');
    
  } catch (error) {
    console.error('\n❌ ERROR DETAILS:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n⚠️  Your Paystack LIVE key is INVALID or has expired');
        console.error('Go to: https://dashboard.paystack.com/#/settings/developer');
        console.error('Switch to LIVE mode and copy your LIVE secret key');
      }
    }
  }
}

testPaystack();