import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import type { CartItem, CustomerInfo } from "../types/product";
import { CheckCircle, MessageCircle, X, Printer, Mail } from "lucide-react";
import { useState, useEffect } from "react";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  customerInfo: CustomerInfo;
  orderNumber: string;
  onWhatsAppRedirect?: () => void;
}

export const ReceiptModal = ({ 
  open, 
  onClose, 
  cart, 
  customerInfo, 
  orderNumber,
  onWhatsAppRedirect 
}: ReceiptModalProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const orderDate = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

const generateReceiptHTML = () => {
const itemsHTML = cart.map(item => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eaeaea; color: #333;">${item.name}</td>
        <td style="padding: 15px; border-bottom: 1px solid #eaeaea; color: #666; font-size: 14px;">${item.category}</td>
        <td style="padding: 15px; border-bottom: 1px solid #eaeaea; text-align: center; color: #333;">${item.quantity}</td>
        <td style="padding: 15px; border-bottom: 1px solid #eaeaea; text-align: right; color: #333; font-weight: 500;">$${item.price.toLocaleString()}</td>
        <td style="padding: 15px; border-bottom: 1px solid #eaeaea; text-align: right; color: #333; font-weight: 600;">$${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    // Generate QR code for verification (using a simple QR code API)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://oticgs.com/verify/${orderNumber}`;
    
    // Payment status based on context (assuming successful for receipt)
    const paymentStatus = "Paid";
    const paymentMethod = "Paystack";
    const paymentReference = orderNumber.replace("ORD-", "PS-");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Receipt - ${orderNumber} | OTIC Geosystems</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              line-height: 1.6;
              color: #2c3e50;
              max-width: 850px;
              margin: 0 auto;
              padding: 0;
              background-color: #f8fafc;
              font-weight: 400;
            }
            
            .receipt-container {
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(8, 23, 72, 0.12);
              margin: 30px auto;
              position: relative;
            }
            
            /* Enhanced Header */
            .receipt-header {
              background: linear-gradient(135deg, #0A2342 0%, #081748 100%);
              color: white;
              padding: 40px 50px 30px;
              text-align: center;
              position: relative;
              border-bottom: 5px solid #3E92CC;
            }
            
            .brand-logo {
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 1px;
              margin: 0 0 8px;
              color: white;
            }
            
            .brand-slogan {
              color: rgba(255, 255, 255, 0.85);
              font-size: 16px;
              margin: 0 0 25px;
              font-weight: 300;
              letter-spacing: 0.5px;
            }
            
            .receipt-title {
              font-size: 24px;
              font-weight: 600;
              margin: 20px 0 10px;
              color: white;
            }
            
            .receipt-meta {
              display: flex;
              justify-content: center;
              gap: 40px;
              margin-top: 25px;
              font-size: 15px;
              color: rgba(255, 255, 255, 0.9);
            }
            
            .receipt-meta div {
              background: rgba(255, 255, 255, 0.1);
              padding: 8px 20px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            
            /* Section Styling */
            .section {
              padding: 35px 50px;
              border-bottom: 1px solid #eef2f7;
            }
            
            .section-title {
              color: #0A2342;
              font-size: 20px;
              font-weight: 600;
              margin: 0 0 25px;
              padding-bottom: 12px;
              border-bottom: 2px solid #f0f4f8;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .section-title::before {
              content: "";
              display: inline-block;
              width: 6px;
              height: 22px;
              background: #3E92CC;
              border-radius: 3px;
            }
            
            /* Enhanced Customer Info Grid */
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 25px;
              background: #f8fafc;
              padding: 25px;
              border-radius: 12px;
              border: 1px solid #eef2f7;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
            }
            
            .info-label {
              font-weight: 600;
              color: #555;
              margin-bottom: 6px;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #666;
            }
            
            .info-value {
              color: #0A2342;
              font-weight: 500;
              font-size: 16px;
              padding: 10px 15px;
              background: white;
              border-radius: 8px;
              border: 1px solid #eaeaea;
            }
            
            /* Enhanced Order Table */
            .order-table-container {
              overflow-x: auto;
              border-radius: 12px;
              border: 1px solid #eef2f7;
              background: white;
            }
            
            .order-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              min-width: 700px;
            }
            
            .order-table th {
              background: #f8fafc;
              color: #555;
              padding: 18px 15px;
              text-align: left;
              font-weight: 600;
              font-size: 14px;
              border-bottom: 2px solid #eef2f7;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .order-table th:nth-child(3),
            .order-table th:nth-child(4),
            .order-table th:nth-child(5) {
              text-align: center;
            }
            
            .order-table td {
              padding: 15px;
              border-bottom: 1px solid #f0f4f8;
              color: #333;
              transition: background-color 0.2s;
            }
            
            .order-table tr:hover td {
              background-color: #f8fafc;
            }
            
            .order-table tr:last-child td {
              border-bottom: none;
            }
            
            /* Enhanced Totals Section */
            .totals-section {
              background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
              padding: 35px 50px;
              border-radius: 12px;
              margin: 30px 50px;
              border: 1px solid #eef2f7;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              padding: 15px 0;
              border-bottom: 1px solid #eef2f7;
              align-items: center;
            }
            
            .total-row:last-child {
              border-bottom: none;
            }
            
            .total-label {
              font-weight: 500;
              color: #555;
              font-size: 16px;
            }
            
            .total-value {
              font-weight: 600;
              color: #333;
              font-size: 16px;
            }
            
            .grand-total {
              background: #0A2342;
              color: white;
              padding: 25px;
              border-radius: 10px;
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-left: 5px solid #3E92CC;
            }
            
            .grand-total .total-label {
              color: white;
              font-size: 20px;
              font-weight: 600;
            }
            
            .grand-total .total-value {
              color: white;
              font-size: 28px;
              font-weight: 700;
            }
            
            /* Payment & Fulfillment Details */
            .payment-details {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-top: 30px;
              padding-top: 30px;
              border-top: 1px solid #eef2f7;
            }
            
            .payment-item {
              background: #f8fafc;
              padding: 20px;
              border-radius: 10px;
              border-left: 4px solid #3E92CC;
            }
            
            .payment-label {
              font-weight: 600;
              color: #555;
              margin-bottom: 8px;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .payment-value {
              color: #0A2342;
              font-weight: 600;
              font-size: 16px;
            }
            
            .status-badge {
              display: inline-block;
              padding: 6px 15px;
              background: #28a745;
              color: white;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            /* Enhanced Footer */
            .receipt-footer {
              background: #0A2342;
              color: white;
              padding: 40px 50px;
              text-align: center;
              border-top: 5px solid #3E92CC;
            }
            
            .footer-content {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 40px;
              margin-bottom: 30px;
            }
            
            .footer-section h4 {
              color: white;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 15px;
              opacity: 0.9;
            }
            
            .footer-links {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            
            .footer-links li {
              margin-bottom: 10px;
            }
            
            .footer-links a {
              color: rgba(255, 255, 255, 0.8);
              text-decoration: none;
              font-size: 14px;
              transition: color 0.2s;
            }
            
            .footer-links a:hover {
              color: #3E92CC;
            }
            
            .qr-section {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 20px;
              margin: 30px 0;
              padding: 25px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 12px;
            }
            
            .qr-text {
              text-align: left;
              max-width: 300px;
            }
            
            .qr-text h4 {
              color: white;
              margin: 0 0 10px;
              font-size: 16px;
            }
            
            .qr-text p {
              color: rgba(255, 255, 255, 0.8);
              font-size: 14px;
              margin: 0;
              line-height: 1.5;
            }
            
            .legal-notice {
              color: rgba(255, 255, 255, 0.7);
              font-size: 13px;
              margin: 30px 0 0;
              padding-top: 20px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              font-style: italic;
            }
            
            .copyright {
              color: rgba(255, 255, 255, 0.6);
              font-size: 12px;
              margin-top: 20px;
            }
            
            /* Utility Classes */
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .mb-0 { margin-bottom: 0; }
            .mt-0 { margin-top: 0; }
            
            @media print {
              body {
                background: white;
                padding: 0;
              }
              
              .receipt-container {
                box-shadow: none;
                margin: 0;
                border-radius: 0;
              }
              
              .receipt-header {
                padding: 30px;
              }
              
              .qr-section {
                page-break-inside: avoid;
              }
            }
            
            @media (max-width: 768px) {
              .section {
                padding: 25px;
              }
              
              .receipt-header {
                padding: 30px 25px;
              }
              
              .receipt-meta {
                flex-direction: column;
                gap: 15px;
              }
              
              .totals-section {
                margin: 20px 25px;
                padding: 25px;
              }
              
              .receipt-footer {
                padding: 30px 25px;
              }
              
              .footer-content {
                grid-template-columns: 1fr;
                gap: 30px;
              }
              
              .qr-section {
                flex-direction: column;
                text-align: center;
              }
              
              .qr-text {
                text-align: center;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Enhanced Header -->
            <div class="receipt-header">
              <h1 class="brand-logo">OTIC GEOSYSTEMS</h1>
              <p class="brand-slogan">Precision Surveying & Geospatial Solutions</p>
              <h2 class="receipt-title">ORDER RECEIPT</h2>
              <div class="receipt-meta">
                <div>Order #: ${orderNumber}</div>
                <div>Date: ${orderDate}</div>
                <div>Status: <span class="status-badge">${paymentStatus}</span></div>
              </div>
            </div>
            
            <!-- Customer Information -->
            <div class="section">
              <h3 class="section-title">Customer Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Customer Name</div>
                  <div class="info-value">${customerInfo.firstName} ${customerInfo.lastName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email Address</div>
                  <div class="info-value">${customerInfo.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">${customerInfo.phone}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Country</div>
                  <div class="info-value">${customerInfo.country}</div>
                </div>
                ${customerInfo.state ? `
                <div class="info-item">
                  <div class="info-label">State/Province</div>
                  <div class="info-value">${customerInfo.state}</div>
                </div>
                ` : ''}
              </div>
            </div>
            
            <!-- Order Items -->
            <div class="section">
              <h3 class="section-title">Order Summary</h3>
              <div class="order-table-container">
                <table class="order-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-value">$${subtotal.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span class="total-label">Tax (7.5%)</span>
                <span class="total-value">$${tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div class="grand-total">
                <span class="total-label">TOTAL AMOUNT</span>
                <span class="total-value">$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            <!-- Payment & Fulfillment Details -->
            <div class="section">
              <h3 class="section-title">Payment Details</h3>
              <div class="payment-details">
                <div class="payment-item">
                  <div class="payment-label">Payment Method</div>
                  <div class="payment-value">${paymentMethod}</div>
                </div>
                <div class="payment-item">
                  <div class="payment-label">Payment Status</div>
                  <div class="payment-value"><span class="status-badge">${paymentStatus}</span></div>
                </div>
                <div class="payment-item">
                  <div class="payment-label">Transaction ID</div>
                  <div class="payment-value">${paymentReference}</div>
                </div>
                <div class="payment-item">
                  <div class="payment-label">Payment Date</div>
                  <div class="payment-value">${orderDate}</div>
                </div>
              </div>
            </div>
            
            <!-- QR Code & Verification -->
            <div class="section">
              <h3 class="section-title">Receipt Verification</h3>
              <div class="qr-section">
                <div class="qr-text">
                  <h4>Verify This Receipt Online</h4>
                  <p>Scan the QR code or visit <strong>oticgs.com/verify/${orderNumber}</strong> to validate this receipt and access your order details.</p>
                </div>
                <img src="${qrCodeUrl}" alt="Receipt Verification QR Code" width="150" height="150" style="border-radius: 8px; border: 3px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              </div>
            </div>
            
            <!-- Enhanced Footer -->
            <div class="receipt-footer">
              <div class="footer-content">
                <div class="footer-section">
                  <h4>Contact & Support</h4>
                  <ul class="footer-links">
                    <li><a href="mailto:support@oticgs.com">📧 support@oticgs.com</a></li>
                    <li><a href="mailto:sales@oticgs.com">💼 sales@oticgs.com</a></li>
                    <li><a href="tel:+2349048332623">📞 +234 904 833 2623</a></li>
                  </ul>
                </div>
                <div class="footer-section">
                  <h4>Quick Links</h4>
                  <ul class="footer-links">
                    <li><a href="https://oticgs.com">🌐 Visit Our Website</a></li>
                  </ul>
                </div>
                <div class="footer-section">
                  <h4>Company</h4>
                  <ul class="footer-links">
                    <li>OTIC Geosystems Ltd.</li>
                    <li>Lagos, Nigeria</li>
                  </ul>
                </div>
              </div>
              
              <p class="legal-notice mb-0">
                This is an official receipt from OTIC Geosystems. This document is generated automatically and serves as valid proof of purchase. No signature required.
              </p>
              
              <p class="copyright mt-0">
                © ${new Date().getFullYear()} OTIC Geosystems. All rights reserved. Receipt ID: ${orderNumber}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  };
  const handlePrint = () => {
    setIsPrinting(true);
    const printContent = document.getElementById('receipt-content');
    
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Order Receipt - ${orderNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
                .header h1 { color:#081748  ; margin: 0; }
                .order-info { margin: 20px 0; }
                .order-info table { width: 100%; border-collapse: collapse; }
                .order-info td { padding: 8px 0; border-bottom: 1px solid #ddd; }
                .order-info td:first-child { color: #666; }
                .order-items { margin: 30px 0; }
                .order-items table { width: 100%; border-collapse: collapse; }
                .order-items th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; }
                .order-items td { padding: 12px; border-bottom: 1px solid #ddd; }
                .total { text-align: right; margin-top: 30px; font-size: 1.2em; font-weight: bold; }
                .footer { margin-top: 50px; text-align: center; color: #666; font-size: 0.9em; }
                @media print {
                  body { padding: 0; margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
              <div class="footer">
                <p>Thank you for your purchase!</p>
                <p>OTIC Geosystems</p>
                <p>Generated on ${new Date().toLocaleString()}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
    
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleSendEmail = async () => {
    if (!customerInfo.email) {
      setEmailStatus({
        type: 'error',
        message: 'Customer email is required'
      });
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus({ type: null, message: '' });

    try {
      const receiptHTML = generateReceiptHTML();
      
      // Create a Blob with the HTML content
      const blob = new Blob([receiptHTML], { type: 'text/html' });
      const formData = new FormData();
      formData.append('receipt', blob, `receipt-${orderNumber}.html`);
      formData.append('orderNumber', orderNumber);
      formData.append('customerEmail', customerInfo.email);
      formData.append('customerName', `${customerInfo.firstName} ${customerInfo.lastName}`);
      formData.append('totalAmount', total.toString());
      
      // Send email via your backend API
      const response = await fetch('https://gs.oticgs.com/api/send-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setEmailStatus({
          type: 'success',
          message: `Receipt sent!`
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setEmailStatus({ type: null, message: '' });
        }, 5000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send email. Please try again.'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (onWhatsAppRedirect) {
      onWhatsAppRedirect();
    }
    // Close the modal after a delay
    setTimeout(() => {
      onClose();
    }, 500);
  };

  // Mobile-optimized content
  const ReceiptContent = () => (
    <div id="receipt-content" className="space-y-4 sm:space-y-6">
      {/* Order Info - Mobile Stacked, Desktop Grid */}
      <div className="bg-blue-900/20 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
        <div className="flex justify-between sm:block">
          <span className="text-blue-300 text-sm">Order Number:  </span>
          <span className="font-mono font-semibold text-white text-sm sm:text-base">{orderNumber}</span>
        </div>
        <div className="flex justify-between sm:block">
          <span className="text-blue-300 text-sm">Order Date:  </span>
          <span className="font-semibold text-white text-sm sm:text-base">{orderDate}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div>
        <h3 className="font-semibold mb-3 text-white text-base sm:text-lg">Customer Information:  </h3>
        <div className="bg-blue-900/20 rounded-lg p-3 sm:p-4 space-y-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-blue-300">First Name:  </span>
            <span className="font-semibold text-white">{customerInfo.firstName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Last Name:  </span>
            <span className="font-semibold text-white">{customerInfo.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Email:  </span>
            <span className="font-semibold text-white truncate ml-2">{customerInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Phone:  </span>
            <span className="font-semibold text-white">{customerInfo.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Country:  </span>
            <span className="font-semibold text-white">{customerInfo.country}</span>
          </div>
          {customerInfo.state && (
            <div className="flex justify-between">
              <span className="text-blue-300">State:  </span>
              <span className="font-semibold text-white">{customerInfo.state}</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="font-semibold mb-3 text-white text-base sm:text-lg">
          Order Items ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h3>
        <div className="space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {cart.map((item) => (
            <div key={item.id} className="bg-blue-900/20 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                  <h4 className="font-semibold text-white text-sm sm:text-base line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-blue-300 text-xs sm:text-sm mt-1">{item.category}</p>
                </div>
                <span className="font-semibold text-white text-sm sm:text-base whitespace-nowrap">
                  ${item.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-300">Quantity: {item.quantity}</span>
                <span className="font-bold text-green-400">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="space-y-3">
        <Separator className="bg-blue-700" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-blue-300">Subtotal</span>
            <span className="font-semibold text-white">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-blue-300">Tax (7.5%)</span>
            <span className="font-semibold text-white">
              ${tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <Separator className="bg-blue-700" />
          <div className="flex justify-between text-lg sm:text-xl font-bold pt-2">
            <span className="text-white">Total Amount</span>
            <span className="text-green-400">
              ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile ? 'w-[95vw] max-w-[95vw] p-4' : 'sm:max-w-2xl p-6'} 
        bg-gradient-to-b from-blue-900 to-blue-950 
        border-blue-800 
        max-h-[90vh] 
        overflow-y-auto
        rounded-xl
        shadow-2xl
      `}>
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-50 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`
              ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} 
              rounded-full 
              bg-green-500/20 
              flex items-center justify-center
              flex-shrink-0
            `}>
              <CheckCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-green-400`} />
            </div>
            <div className="flex-1">
              <DialogTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} text-white`}>
                Order Confirmed! 
              </DialogTitle>
              <p className="text-blue-300 mt-1 text-sm">
                {onWhatsAppRedirect 
                  ? "Review your receipt and complete payment" 
                  : "Thank you for your purchase"
                }
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4 sm:mt-6">
          <ReceiptContent />
          
          {/* Email Status Message */}
          {emailStatus.type && (
            <div className={`mt-4 p-3 sm:p-4 rounded-lg border ${
              emailStatus.type === 'success' 
                ? 'bg-green-900/30 border-green-800' 
                : 'bg-red-900/30 border-red-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  emailStatus.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {emailStatus.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    emailStatus.type === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {emailStatus.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* WhatsApp Notice */}
          {onWhatsAppRedirect && (
            <div className="mt-4 p-3 sm:p-4 bg-green-900/30 border border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-300 text-sm sm:text-base">
                    Complete Payment via WhatsApp
                  </h4>
                  <p className="text-blue-200 text-xs sm:text-sm mt-1">
                    You'll be redirected to WhatsApp to complete your payment and receive support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-blue-800">
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 mb-3`}>
              <Button 
                onClick={handlePrint}
                disabled={isPrinting}
                variant="outline"
                className={`
                  ${isMobile ? 'w-full' : 'flex-1'} 
                  gap-2 
                  border-blue-600 
                  text-blue-400 
                  hover:bg-blue-900 
                  hover:text-white
                `}
              >
                {isPrinting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />
                    Printing...
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    {isMobile ? 'Print' : 'Print Receipt'}
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleSendEmail}
                disabled={isSendingEmail || !customerInfo.email}
                variant="outline"
                className={`
                  ${isMobile ? 'w-full' : 'flex-1'} 
                  gap-2 
                  border-green-600 
                  text-green-400 
                  hover:bg-green-900 
                  hover:text-white
                `}
              >
                {isSendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    {isMobile ? 'Email Receipt' : 'Email Receipt'}
                  </>
                )}
              </Button>
            </div>
            
            {onWhatsAppRedirect ? (
              <Button 
                onClick={handleWhatsAppClick} 
                className={`
                  ${isMobile ? 'w-full' : 'w-full'} 
                  gap-2 
                  bg-green-600 
                  hover:bg-green-700
                  text-white
                  mt-3
                `}
              >
                <MessageCircle className="w-4 h-4" />
                {isMobile ? 'WhatsApp Payment' : 'Complete via WhatsApp'}
              </Button>
            ) : (
              <Button 
                onClick={onClose} 
                className={`
                  ${isMobile ? 'w-full' : 'w-full'} 
                  bg-blue-600 
                  hover:bg-blue-700
                  text-white
                  mt-3
                `}
              >
                {isMobile ? 'Continue' : 'Continue Shopping'}
              </Button>
            )}
            
            {onWhatsAppRedirect && (
              <Button 
                onClick={onClose} 
                variant="ghost"
                className="w-full mt-3 text-blue-300 hover:text-white hover:bg-blue-900/50"
              >
                {isMobile ? 'Close Receipt' : 'Continue Shopping (Close Receipt)'}
              </Button>
            )}

            {/* Additional Info */}
            <div className="mt-4 text-center">
              <p className="text-blue-400 text-xs">
                Need help? Contact support@oticgs.com
              </p>
              <p className="text-blue-500 text-xs mt-1">
                Order reference: {orderNumber}
              </p>
              <p className="text-blue-300 text-xs mt-2">
                Receipt will be sent to {customerInfo.email} 
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet Effect */}
        {isMobile && (
          <div className="sticky bottom-0 left-0 right-0 h-2 flex justify-center mt-4">
            <div className="w-12 h-1 bg-blue-700 rounded-full"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};