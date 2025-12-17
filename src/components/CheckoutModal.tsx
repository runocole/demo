import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import type { CustomerInfo, CartItem } from "../types/product";
import { CreditCard, CheckCircle, ArrowLeft } from "lucide-react";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara"
];

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (info: CustomerInfo, orderNumber: string) => void;
  cart?: CartItem[];
}

export const CheckoutModal = ({ open, onClose, onComplete, cart = [] }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "review">("form");
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setGeneratedOrderNumber(orderNumber);
      setStep("review");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaystackPayment = async () => {
    setIsLoading(true);
    const totalAmount = calculateTotal();
    
    try {
      const response = await fetch('http://localhost:5000/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          amount: totalAmount,
          orderNumber: generatedOrderNumber,
          metadata: {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_state: formData.state,
            cart_items: cart.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              category: item.category
            }))
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Call onComplete before redirecting
        onComplete(formData, generatedOrderNumber);
        
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        throw new Error(data.error || 'Payment failed');
      }
      
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const handleClose = () => {
    onClose();
    setStep("form");
    setFormData({ name: "", email: "", phone: "", state: "" });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            <div className="flex items-center gap-2">
              {step === "form" ? (
                <CreditCard className="w-6 h-6 text-blue-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {step === "form" ? "Secure Checkout" : "Review & Pay"}
            </div>
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-2">
            {step === "form" 
              ? "Complete your order with secure payment"
              : "Review your order before payment"}
          </p>
        </DialogHeader>

        {step === "form" ? (
          <>
            <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="font-semibold mb-3 text-white">Order Summary</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-white">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between font-bold text-lg">
                <span className="text-white">Total:</span>
                <span className="text-primary">₦{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
                    placeholder="2348012345678"
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-400">
                    For order confirmation and updates
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">
                    State
                  </Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">Select a state</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-300">Secure Payment Process:</h4>
                    <ul className="text-sm text-gray-300 mt-2 space-y-1">
                      <li>• Fill in your details above</li>
                      <li>• Review your order summary</li>
                      <li>• Pay securely via Paystack (Cards, Bank Transfer, USSD)</li>
                      <li>• Receive email confirmation instantly</li>
                      <li>• Get order updates via email</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Review Order
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          // REVIEW STEP
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold mb-3 text-white">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order Number</span>
                  <span className="font-mono font-semibold text-white">{generatedOrderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order Date</span>
                  <span className="font-semibold text-white">
                    {new Date().toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold mb-3 text-white">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name</span>
                  <span className="font-semibold text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="font-semibold text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone</span>
                  <span className="font-semibold text-white">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">State</span>
                  <span className="font-semibold text-white">{formData.state || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold mb-3 text-white">Order Items</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">x{item.quantity}</p>
                      <p className="text-sm font-bold text-primary">
                        ₦{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold text-white">₦{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (8%)</span>
                  <span className="font-semibold text-white">₦{calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-primary">
                      ₦{(calculateSubtotal() + calculateTax()).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("form")}
                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
              <Button
                onClick={handlePaystackPayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay Securely with Paystack
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-400">
              You'll be redirected to Paystack for secure payment processing.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};