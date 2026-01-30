// API Configuration
const config = {
  // Django Backend (Blog API)
  DJANGO_API: 'https://oticgs-1.onrender.com/api',
  
  // Node.js Backend (Payments)
  NODE_API: 'https://gs.oticgs.com/api',
  
  // Specific Endpoints
  endpoints: {
    // Blog Posts
    blogPosts: 'https://oticgs-1.onrender.com/api/posts/',
    
    // Payments
    initializePayment: 'https://gs.oticgs.com/api/paystack/initialize',
    verifyPayment: (reference: string) => 
      'https://gs.oticgs.com/api/paystack/verify/' + reference,
  }
};

export default config;
