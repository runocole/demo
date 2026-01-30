import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle, Mail, Printer, Home, Package } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import type { CustomerInfo, CartItem } from "../types/product";

interface OrderDetails {
  orderNumber: string;
  customerInfo: CustomerInfo;
  cart: CartItem[];
  paymentReference: string;
  amount: number;
  paymentDate: string;
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const verifyPaymentAndSendEmail = async () => {
      try {
        const reference = searchParams.get('reference');
        const trxref = searchParams.get('trxref');
        
        if (!reference && !trxref) {
          setPaymentStatus('failed');
          setIsLoading(false);
          return;
        }

        const paymentRef = reference || trxref;
        
        // Get order details from localStorage (saved during checkout)
        const orderNumber = localStorage.getItem('lastOrderNumber');
        const customerInfoStr = localStorage.getItem('lastCustomerInfo');
        const cartStr = localStorage.getItem('lastCart');
        
        if (!orderNumber || !customerInfoStr) {
          setPaymentStatus('failed');
          setIsLoading(false);
          return;
        }

        const customerInfo: CustomerInfo = JSON.parse(customerInfoStr);
        const cart: CartItem[] = cartStr ? JSON.parse(cartStr) : [];

        console.log('Verifying payment:', paymentRef);
        console.log('Order:', orderNumber);
        console.log('Customer:', customerInfo.email);

        // Step 1: Verify Paystack payment
        const verifyResponse = await fetch('https://gs.oticgs.com/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: paymentRef })
        });

        const verifyResult = await verifyResponse.json();
        
        if (verifyResult.success && verifyResult.data.status === 'success') {
          setPaymentStatus('success');
          
          // Step 2: Send receipt email automatically
          try {
            // Generate receipt HTML (simplified version)
            const receiptHTML = `
              <!DOCTYPE html>
              <html>
              <head><title>Receipt ${orderNumber}</title></head>
              <body>
                <h1>OTIC Geosystems</h1>
                <h2>Order Receipt - ${orderNumber}</h2>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Customer: ${customerInfo.firstName} ${customerInfo.lastName}</p>
                <p>Email: ${customerInfo.email}</p>
                <p>Phone: ${customerInfo.phone}</p>
                <p>Country: ${customerInfo.country}</p>
                ${customerInfo.state ? `<p>State: ${customerInfo.state}</p>` : ''}
                <h3>Order Items:</h3>
                ${cart.map((item: CartItem) => `
                  <p>${item.name} x ${item.quantity} - $${item.price}</p>
                `).join('')}
                <h3>Total: $${cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0).toFixed(2)}</h3>
              </body>
              </html>
            `;
            
            // Calculate total
            const totalAmount = cart.reduce((sum: number, item: CartItem) => 
              sum + (item.price * item.quantity), 0
            );
            
            // Create FormData for email
            const blob = new Blob([receiptHTML], { type: 'text/html' });
            const formData = new FormData();
            formData.append('receipt', blob, `receipt-${orderNumber}.html`);
            formData.append('orderNumber', orderNumber);
            formData.append('customerEmail', customerInfo.email);
            formData.append('customerName', `${customerInfo.firstName} ${customerInfo.lastName}`);
            formData.append('totalAmount', totalAmount.toString());
            
            // Send email
            const emailResponse = await fetch('https://gs.oticgs.com/api/send-receipt', {
              method: 'POST',
              body: formData,
            });
            
            const emailResult = await emailResponse.json();
            
            if (emailResult.success) {
              toast({
                title: "Receipt Sent!",
                description: `Order confirmation and receipt sent to ${customerInfo.email}`,
                variant: "default",
              });
            }
            
            // Save order details for display
            setOrderDetails({
              orderNumber,
              customerInfo,
              cart,
              paymentReference: paymentRef!,
              amount: verifyResult.data.amount / 100, // Convert from kobo
              paymentDate: new Date(verifyResult.data.paid_at).toLocaleDateString()
            });
            
            // Clear localStorage
            localStorage.removeItem('lastOrderNumber');
            localStorage.removeItem('lastCustomerInfo');
            localStorage.removeItem('lastCart');
            
          } catch (emailError) {
            console.error('Email sending failed:', emailError);
            toast({
              title: "Payment Success",
              description: "Payment successful but email failed. Please contact support.",
              variant: "destructive",
            });
          }
          
        } else {
          setPaymentStatus('failed');
          toast({
            title: "Payment Failed",
            description: verifyResult.data?.message || "Payment verification failed",
            variant: "destructive",
          });
        }
        
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        toast({
          title: "Verification Error",
          description: "Failed to verify payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPaymentAndSendEmail();
  }, [searchParams, toast]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying your payment...</p>
          <p className="text-blue-300 text-sm">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-blue-800/30 rounded-xl p-8 border border-blue-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-red-400 text-2xl">✗</div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
            <p className="text-blue-300 mb-6">
              We couldn't verify your payment. Please check your payment method and try again.
            </p>
            <Button 
              onClick={handleGoHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful! 🎉</h1>
          <p className="text-blue-300 text-lg">
            Thank you for your order. Your receipt has been sent to your email.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Summary
          </h2>
          
          {orderDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-blue-300 text-sm">Order Number</p>
                  <p className="text-white font-mono font-bold">{orderDetails.orderNumber}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-300 text-sm">Payment Reference</p>
                  <p className="text-white font-mono">{orderDetails.paymentReference}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-300 text-sm">Date</p>
                  <p className="text-white">{orderDetails.paymentDate}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-300 text-sm">Amount Paid</p>
                  <p className="text-white font-bold">₦{orderDetails.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-blue-800">
                <p className="text-blue-300 text-sm mb-2">Customer Details</p>
                <p className="text-white">
                  {orderDetails.customerInfo.firstName} {orderDetails.customerInfo.lastName}
                </p>
                <p className="text-blue-300">{orderDetails.customerInfo.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800 mb-6">
          <h3 className="text-lg font-bold text-white mb-3">What Happens Next</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-3 h-3 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Receipt Sent to Email</p>
                <p className="text-blue-300 text-sm">
                  Check your inbox (and spam folder) for the order receipt
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Order Processing</p>
                <p className="text-blue-300 text-sm">
                  Our team will process your order within 24 hours
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Shipping & Delivery</p>
                <p className="text-blue-300 text-sm">
                  You'll receive shipping updates via email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handlePrintReceipt}
            variant="outline"
            className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-900 hover:text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
          <Button
            onClick={handleGoHome}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-blue-400 text-sm">
            Need help? Contact support@oticgs.com
          </p>
          <p className="text-blue-500 text-xs mt-2">
            Thank you for choosing OTIC Geosystems!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;