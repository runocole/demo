import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import type { CartItem, CustomerInfo } from "../types/product";
import { CheckCircle, Download, MessageCircle } from "lucide-react";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  customerInfo: CustomerInfo;
  orderNumber: string;
  onWhatsAppRedirect?: () => void; // Add this optional prop
}

export const ReceiptModal = ({ 
  open, 
  onClose, 
  cart, 
  customerInfo, 
  orderNumber,
  onWhatsAppRedirect 
}: ReceiptModalProps) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const orderDate = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  const handlePrint = () => {
    window.print();
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-[#081748] border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Order Confirmed!</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {onWhatsAppRedirect 
                  ? "Review your receipt and complete payment via WhatsApp" 
                  : "Thank you for your purchase"
                }
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Order Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-mono font-semibold">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-semibold">{orderDate}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-semibold">{customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold">{customerInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-semibold">{customerInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">State</span>
                <span className="font-semibold">{customerInfo.state}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <span className="font-semibold">${item.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Quantity: {item.quantity}</span>
                    <span className="font-bold text-primary">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-semibold">${tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Notice */}
          {onWhatsAppRedirect && (
            <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-300">Complete Payment via WhatsApp</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    You'll be redirected to WhatsApp automatically in a few seconds to complete your payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Download className="w-4 h-4" />
                Print Receipt
              </Button>
              
              {onWhatsAppRedirect ? (
                <Button 
                  onClick={handleWhatsAppClick} 
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  Complete via WhatsApp Now
                </Button>
              ) : (
                <Button onClick={onClose} className="flex-1">
                  Continue Shopping
                </Button>
              )}
            </div>
            
            {onWhatsAppRedirect && (
              <Button 
                onClick={onClose} 
                variant="ghost"
                className="mt-2"
              >
                Continue Shopping (Close Receipt)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};