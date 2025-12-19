import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import type { CartItem, CustomerInfo } from "../types/product";
import { CheckCircle, MessageCircle, X, Printer } from "lucide-react";
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
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const orderDate = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

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
                .header h1 { color: #081748; margin: 0; }
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
                <p>Geosso Technologies Limited</p>
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
          <span className="text-blue-300 text-sm">Order Number</span>
          <span className="font-mono font-semibold text-white text-sm sm:text-base">{orderNumber}</span>
        </div>
        <div className="flex justify-between sm:block">
          <span className="text-blue-300 text-sm">Order Date</span>
          <span className="font-semibold text-white text-sm sm:text-base">{orderDate}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div>
        <h3 className="font-semibold mb-3 text-white text-base sm:text-lg">Customer Information</h3>
        <div className="bg-blue-900/20 rounded-lg p-3 sm:p-4 space-y-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-blue-300">First Name</span>
            <span className="font-semibold text-white">{customerInfo.firstName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Last Name</span>
            <span className="font-semibold text-white">{customerInfo.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Email</span>
            <span className="font-semibold text-white truncate ml-2">{customerInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Phone</span>
            <span className="font-semibold text-white">{customerInfo.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">State</span>
            <span className="font-semibold text-white">{customerInfo.state}</span>
          </div>
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
            <span className="text-blue-300">Tax (8%)</span>
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
                Order Confirmed! 🎉
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
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
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
              
              {onWhatsAppRedirect ? (
                <Button 
                  onClick={handleWhatsAppClick} 
                  className={`
                    ${isMobile ? 'w-full' : 'flex-1'} 
                    gap-2 
                    bg-green-600 
                    hover:bg-green-700
                    text-white
                  `}
                >
                  <MessageCircle className="w-4 h-4" />
                  {isMobile ? 'WhatsApp Payment' : 'Complete via WhatsApp'}
                </Button>
              ) : (
                <Button 
                  onClick={onClose} 
                  className={`
                    ${isMobile ? 'w-full' : 'flex-1'} 
                    bg-blue-600 
                    hover:bg-blue-700
                    text-white
                  `}
                >
                  {isMobile ? 'Continue' : 'Continue Shopping'}
                </Button>
              )}
            </div>
            
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
                Need help? Contact support@geosso.com
              </p>
              <p className="text-blue-500 text-xs mt-1">
                Order reference: {orderNumber}
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