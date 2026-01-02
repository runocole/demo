// config/whatsapp.ts

export const WHATSAPP_CONFIG = {
  businessNumber: "2349026194016", 
  
  // Message templates
  templates: {
    newOrder: (orderNumber: string) => 
      `*🛒 NEW ORDER - ${orderNumber}*\n\n`,
    
    orderDetails: (items: string, total: string, currency: string = '₦') =>
      `*Order Details:*\n${items}\n\n*Total:* ${currency}${total}\n\n`,
    
    customerInfo: (firstName: string, lastName: string, email: string, phone: string, country: string, state: string) =>
      `*Customer Information*\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nCountry: ${country}${state ? `\nState: ${state}` : ''}\n\n`,
    
    // Mobile-optimized shorter templates
    mobileNewOrder: (orderNumber: string) => 
      `*Order #${orderNumber}*\n`,
  },
  
  // Business hours (optional)
  businessHours: {
    open: "9:00 AM",
    close: "6:00 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  
  mobile: {
    maxItemsInMessage: 3, 
    truncateItemName: 50, 
    useEmojis: true,
  }
};

export const formatWhatsAppNumber = (number: string): string => {
  return number.replace(/[\s\-+]/g, '');
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile devices
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobile = mobileRegex.test(userAgent);
  
  // Also check screen size
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobile || isSmallScreen;
};

// Generate WhatsApp URL with mobile optimization
export const generateWhatsAppUrl = (
  cartItems: Array<{ firstName: string; lastName: string; quantity: number; price: number }>,
  customerInfo: { 
    firstName: string; 
    lastName: string;
    email: string; 
    phone: string; 
    country: string;
    state: string 
  },
  orderNumber: string,
  currency: 'NGN' | 'USD' = 'NGN',
  isMobile?: boolean // Optional: override mobile detection
): string => {
  // Detect if mobile if not explicitly provided
  const mobileMode = isMobile !== undefined ? isMobile : isMobileDevice();
  
  const currencySymbol = currency === 'USD' ? '$' : '₦';
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  // Format total based on currency
  const displayTotal = currency === 'USD' ? total.toFixed(2) : total.toFixed(0);
  
  // Truncate long item names for mobile
  const formatItemName = (name: string): string => {
    if (mobileMode && name.length > WHATSAPP_CONFIG.mobile.truncateItemName) {
      return name.substring(0, WHATSAPP_CONFIG.mobile.truncateItemName) + '...';
    }
    return name;
  };
  
  // Format items based on currency and device type
  let itemsText: string;
  
  if (mobileMode && cartItems.length > WHATSAPP_CONFIG.mobile.maxItemsInMessage) {
    // For mobile, show summary if too many items
    const firstItems = cartItems.slice(0, WHATSAPP_CONFIG.mobile.maxItemsInMessage);
    const remainingCount = cartItems.length - WHATSAPP_CONFIG.mobile.maxItemsInMessage;
    
    itemsText = firstItems
      .map(item => {
        const itemTotal = item.price * item.quantity;
        const displayPrice = currency === 'USD' ? itemTotal.toFixed(2) : itemTotal.toFixed(0);
        const emoji = WHATSAPP_CONFIG.mobile.useEmojis ? '✅ ' : '';
        return `${emoji}${formatItemName(item.firstName + ' ' + item.lastName)} x${item.quantity} - ${currencySymbol}${displayPrice}`;
      })
      .join('\n');
    
    if (remainingCount > 0) {
      itemsText += `\n+ ${remainingCount} more item${remainingCount > 1 ? 's' : ''}`;
    }
  } else {
    // For desktop or small number of items
    itemsText = cartItems
      .map(item => {
        const itemTotal = item.price * item.quantity;
        const displayPrice = currency === 'USD' ? itemTotal.toFixed(2) : itemTotal.toFixed(0);
        const bullet = mobileMode && WHATSAPP_CONFIG.mobile.useEmojis ? '✅ ' : '• ';
        return `${bullet}${formatItemName(item.firstName + ' ' + item.lastName)} x${item.quantity} - ${currencySymbol}${displayPrice}`;
      })
      .join('\n');
  }
  
  // Choose template based on device
  const header = mobileMode 
    ? WHATSAPP_CONFIG.templates.mobileNewOrder(orderNumber)
    : WHATSAPP_CONFIG.templates.newOrder(orderNumber);
  
  // Build message based on device type
  let message = header;
  
  if (!mobileMode) {
    // Full desktop message
    message += WHATSAPP_CONFIG.templates.orderDetails(itemsText, displayTotal, currencySymbol) +
      WHATSAPP_CONFIG.templates.customerInfo(
        customerInfo.firstName,
        customerInfo.lastName,
        customerInfo.email,
        customerInfo.phone,
        customerInfo.country,
        customerInfo.state || ""
      ) +
      `*Order Date:* ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}\n` +
      `*Order Time:* ${new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}\n\n`;
  } else {
    // Mobile-optimized message
    message += `*${cartItems.length} Item${cartItems.length > 1 ? 's' : ''}*\n`;
    message += itemsText + '\n\n';
    message += `*Total:* ${currencySymbol}${displayTotal}\n\n`;
    message += `*Customer:* ${customerInfo.firstName} ${customerInfo.lastName}\n`;
    message += `*Phone:* ${customerInfo.phone}\n`;
    if (customerInfo.email) message += `*Email:* ${customerInfo.email}\n`;
    message += '\n';
  }
  
  // Common payment instructions (optimized for mobile)
  const paymentInstructions = mobileMode
    ? `*Payment:*\nReply with preferred method:\n• Bank Transfer\n• Card\n• Cash (if available)\n\nThanks! 🎉`
    : `*Payment Instructions:*\nPlease reply with your preferred payment method:\n• Bank Transfer\n• Card Payment\n• Cash on Delivery (if available)\n\nThank you for your order! 🎉`;
  
  message += paymentInstructions;
  
  // Add business hours in footer for mobile
  if (mobileMode) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const isBusinessDay = WHATSAPP_CONFIG.businessHours.days.includes(currentDay);
    const isBusinessHour = currentHour >= 9 && currentHour < 18;
    
    if (!isBusinessDay || !isBusinessHour) {
      message += `\n\n*Note:* Outside business hours. We'll respond during ${WHATSAPP_CONFIG.businessHours.open}-${WHATSAPP_CONFIG.businessHours.close} ${WHATSAPP_CONFIG.businessHours.days.join(', ')}`;
    }
  }
  
  // Generate WhatsApp URL
  const formattedNumber = formatWhatsAppNumber(WHATSAPP_CONFIG.businessNumber);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
};

// Mobile-specific WhatsApp button URL generator
export const generateMobileWhatsAppUrl = (
  text: string = "Hello! I'm interested in your products"
): string => {
  const formattedNumber = formatWhatsAppNumber(WHATSAPP_CONFIG.businessNumber);
  const encodedMessage = encodeURIComponent(text);
  
  // For mobile, use direct chat URL
  return `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`;
};

// Generate WhatsApp contact URL (for customer support)
export const generateWhatsAppContactUrl = (
  message: string = "Hello, I need assistance with your products",
  isMobile?: boolean
): string => {
  const mobileMode = isMobile !== undefined ? isMobile : isMobileDevice();
  
  // For mobile, use simpler message format
  const finalMessage = mobileMode 
    ? `${message}\n\n(Sent from Geosso Technologies Website)`
    : `${message}\n\n---\n*Inquiry from Geosso Technologies Website*\n${new Date().toLocaleString()}`;
  
  const formattedNumber = formatWhatsAppNumber(WHATSAPP_CONFIG.businessNumber);
  const encodedMessage = encodeURIComponent(finalMessage);
  
  return mobileMode
    ? `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`
    : `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
};

// Check if WhatsApp is available on the device
export const isWhatsAppAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check if it's a mobile device
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // WhatsApp is available on all iOS and Android devices
  // Also check if we're in a browser that supports WhatsApp Web
  const isDesktop = !isMobile;
  
  // WhatsApp Web works on desktop browsers
  if (isDesktop) {
    return true; // WhatsApp Web is available
  }
  
  // For mobile, WhatsApp should be available
  return isMobile;
};

// Get appropriate WhatsApp link based on device
export const getWhatsAppLink = (
  type: 'order' | 'contact' | 'support' = 'contact',
  data?: any
): string => {
  const mobile = isMobileDevice();
  
  switch (type) {
    case 'order':
      if (!data?.cartItems || !data?.customerInfo || !data?.orderNumber) {
        return generateWhatsAppContactUrl("I'd like to place an order", mobile);
      }
      return generateWhatsAppUrl(
        data.cartItems,
        data.customerInfo,
        data.orderNumber,
        data.currency,
        mobile
      );
    
    case 'support':
      return generateWhatsAppContactUrl("I need technical support", mobile);
    
    case 'contact':
    default:
      return generateWhatsAppContactUrl(undefined, mobile);
  }
};

// Format phone number for display
export const formatPhoneDisplay = (phone: string): string => {
  const cleaned = formatWhatsAppNumber(phone);
  
  if (cleaned.startsWith('234')) {
    const areaCode = cleaned.substring(3, 6);
    const firstPart = cleaned.substring(6, 9);
    const secondPart = cleaned.substring(9, 13);
    return `+234 ${areaCode} ${firstPart} ${secondPart}`;
  }
  
  // Default format
  return `+${cleaned}`;
};