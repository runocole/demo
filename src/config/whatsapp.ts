// config/whatsapp.ts

export const WHATSAPP_CONFIG = {
  // 👇 Replace with your actual WhatsApp business number
  businessNumber: "2348063304716", // Without +, country code format
  
  // Message templates
  templates: {
    newOrder: (orderNumber: string) => 
      `*🛒 NEW ORDER - ${orderNumber}*\n\n`,
    
    orderDetails: (items: string, total: string) =>
      `*Order Details:*\n${items}\n\n*Total:* ${total}\n\n`,
    
    customerInfo: (name: string, email: string, phone: string, state: string) =>
      `*Customer Information*\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nState: ${state}\n\n`,
  },
  
  // Business hours (optional)
  businessHours: {
    open: "9:00 AM",
    close: "6:00 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  }
};

// Helper function to format WhatsApp number
export const formatWhatsAppNumber = (number: string): string => {
  // Remove any spaces, dashes, or plus signs
  return number.replace(/[\s\-+]/g, '');
};

// Generate WhatsApp URL
export const generateWhatsAppUrl = (
  cartItems: Array<{ name: string; quantity: number; price: number }>,
  customerInfo: { name: string; email: string; phone: string; state: string },
  orderNumber: string
): string => {
  const itemsText = cartItems
    .map(item => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const message = 
    WHATSAPP_CONFIG.templates.newOrder(orderNumber) +
    WHATSAPP_CONFIG.templates.orderDetails(itemsText, `$${total.toFixed(2)}`) +
    WHATSAPP_CONFIG.templates.customerInfo(
      customerInfo.name,
      customerInfo.email,
      customerInfo.phone,
      customerInfo.state || "Not specified"
    ) +
    `*Order Date:* ${new Date().toLocaleDateString()}\n` +
    `*Order Time:* ${new Date().toLocaleTimeString()}`;
  
  const formattedNumber = formatWhatsAppNumber(WHATSAPP_CONFIG.businessNumber);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
};