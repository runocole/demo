import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import type { CustomerInfo, CartItem } from "../types/product";
import { 
  CreditCard, CheckCircle, ArrowLeft, Search, MessageCircle, 
  ExternalLink, MapPin, User, Mail, Phone, ChevronDown,
} from "lucide-react";
import { generateWhatsAppUrl } from "../config/whatsapp";
import { Badge } from "./ui/badge";
import { useCurrency } from "../context/CurrencyContext";

// List of all 195 countries
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", 
  "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", 
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", 
  "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", 
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", 
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", 
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", 
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", 
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
  "Yemen", "Zambia", "Zimbabwe"
];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara"
];

type PaymentMethod = "paystack" | "whatsapp";
type CheckoutStep = "form" | "method" | "review";
type ViewMode = "checkout" | "details-only";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (info: CustomerInfo, orderNumber: string) => void;
  cart?: CartItem[];
}

export const CheckoutModal = ({ 
  open, 
  onClose, 
  onComplete, 
  cart = [], 
}: CheckoutModalProps) => {
  const { toast } = useToast();
  const { currentCurrency, getConvertedPrice, exchangeRate } = useCurrency();
  
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("form");
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("checkout");
  const [showViewDetails, setShowViewDetails] = useState(false);

  // Check if mobile
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FIXED: Helper function to convert USD amount to current currency (as number)
  const convertAmountToCurrentCurrency = (usdAmount: number): number => {
    if (currentCurrency === 'NGN') {
      return usdAmount * exchangeRate;
    }
    return usdAmount;
  };

  // FIXED: Calculate everything in USD first, then convert for display/calculation
  const calculateSubtotalUSD = (): number => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTaxUSD = (): number => {
    return calculateSubtotalUSD() * 0.08;
  };

  const calculateTotalUSD = (): number => {
    return calculateSubtotalUSD() + calculateTaxUSD();
  };

  // FIXED: Get amounts in current currency (as numbers)
  const getSubtotalInCurrentCurrency = (): number => {
    return convertAmountToCurrentCurrency(calculateSubtotalUSD());
  };

  const getTaxInCurrentCurrency = (): number => {
    return convertAmountToCurrentCurrency(calculateTaxUSD());
  };

  const getTotalInCurrentCurrency = (): number => {
    return convertAmountToCurrentCurrency(calculateTotalUSD());
  };

  // FIXED: For Paystack - convert USD to NGN
  const convertUSDToNGN = (usdAmount: number): number => {
    return Math.round(usdAmount * exchangeRate);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.country) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.country === "Nigeria" && !formData.state) {
      toast({
        title: "Missing Information",
        description: "Please select a state for Nigeria",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setGeneratedOrderNumber(orderNumber);
      setStep("method");
      
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

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setStep("review");
  };

  const handlePaystackPayment = async () => {
    setIsLoading(true);
    
    // Calculate total in USD
    const totalUSD = calculateTotalUSD();
    
    console.log('=== PAYSTACK PAYMENT CALCULATION ===');
    console.log('Total USD:', totalUSD);
    console.log('Current Currency:', currentCurrency);
    console.log('Exchange Rate:', exchangeRate);
    
    // Convert to NGN for Paystack
    const amountInNGN = convertUSDToNGN(totalUSD);
    console.log('Amount in NGN:', amountInNGN);
    console.log('Expected: ₦', amountInNGN.toLocaleString('en-NG'));
    
    // Paystack expects amount in kobo (smallest NGN unit)
    // Check if amount is within Paystack limits
    if (amountInNGN > 25000000) { // If more than ₦25 million
      toast({
        title: "Amount Too Large",
        description: "This amount exceeds Paystack's transaction limit. Please contact us for alternative payment methods.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    const amountForPayment = Math.round(amountInNGN * 100); // Convert to kobo
    
    console.log('Amount for Paystack (kobo):', amountForPayment);
    console.log('====================================');
    
    try {
      const response = await fetch('http://localhost:5000/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          amount: amountForPayment, // Send amount in kobo
          orderNumber: generatedOrderNumber,
          metadata: {
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_phone: formData.phone,
            customer_country: formData.country,
            customer_state: formData.state,
            original_currency: currentCurrency,
            original_amount_usd: totalUSD,
            original_amount_current: getTotalInCurrentCurrency(),
            exchange_rate: exchangeRate,
            conversion_applied: currentCurrency !== 'NGN',
            cart_items: cart.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price_usd: item.price,
              price_current: convertAmountToCurrentCurrency(item.price),
              price_currency: currentCurrency,
              category: item.category
            }))
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Clear cart after successful payment initialization
        localStorage.removeItem('cart');
        
        onComplete(formData, generatedOrderNumber);
        window.location.href = data.authorization_url;
      } else {
        throw new Error(data.error || data.message || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    const customerState = formData.state || "Not specified";
    
    // Format cart items - use USD prices
    const formattedCartItems = cart.map(item => {
      return {
        firstName: item.name,
        lastName: "",
        quantity: item.quantity,
        price: item.price, // USD price
      };
    });

    const customerInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      state: customerState
    };

    // Generate WhatsApp URL with correct currency
    const whatsappUrl = generateWhatsAppUrl(
      formattedCartItems,
      customerInfo,
      generatedOrderNumber,
      currentCurrency as 'NGN' | 'USD'
    );

    // Clear cart
    localStorage.removeItem('cart');
    
    // Complete checkout and redirect to WhatsApp
    onComplete(formData, generatedOrderNumber);
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    toast({
      title: "WhatsApp Order Created",
      description: "Your order has been sent via WhatsApp. Please complete your payment with the business.",
      variant: "default",
    });
    
    // Close modal after a delay
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setStep("form");
    setFormData({ 
      firstName: "", 
      lastName: "", 
      email: "", 
      phone: "", 
      country: "", 
      state: "" 
    });
    setSearchQuery("");
    setShowSearch(false);
    setSelectedPaymentMethod(null);
    setViewMode("checkout");
    setShowViewDetails(false);
  };

  const handleCountryChange = (country: string) => {
    setFormData({ 
      ...formData, 
      country, 
      state: ""
    });
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleCountrySelect = (country: string) => {
    handleCountryChange(country);
  };

  const handleViewDetails = () => {
    setViewMode("details-only");
    setShowViewDetails(true);
  };

  const handleCloseViewDetails = () => {
    setViewMode("checkout");
    setShowViewDetails(false);
  };

  const getDialogTitle = () => {
    if (viewMode === "details-only") {
      return "Order Details";
    }
    
    switch (step) {
      case "form":
        return "Checkout";
      case "method":
        return "Payment Method";
      case "review":
        return selectedPaymentMethod === "whatsapp" 
          ? "WhatsApp Order" 
          : "Review Payment";
      default:
        return "Checkout";
    }
  };

  const CountrySelector = () => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <Label htmlFor="country" className="text-white">
            Country <span className="text-red-500">*</span>
          </Label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            required
            disabled={isLoading}
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="country" className="text-white">
          Country <span className="text-red-500">*</span>
        </Label>
        
        {!showSearch ? (
          <div className="flex gap-2">
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              disabled={isLoading}
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSearch(true)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for a country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 text-white border-gray-700"
                autoFocus
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-md">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-800 ${
                      formData.country === country ? 'bg-gray-800' : ''
                    }`}
                  >
                    {country}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400 text-center">
                  No countries found
                </div>
              )}
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="w-full border-gray-700 text-white hover:bg-gray-800 mt-2"
            >
              Back to dropdown
            </Button>
          </div>
        )}
        
        {formData.country && (
          <p className="text-sm text-gray-400 mt-1">
            Selected: <span className="font-semibold text-white">{formData.country}</span>
          </p>
        )}
      </div>
    );
  };

  const MobileStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {["form", "method", "review"].map((s, index) => (
        <div key={s} className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step === s ? 'bg-blue-600 text-white' : 
            step === "review" && index === 2 ? 'bg-blue-600 text-white' :
            step === "method" && index <= 1 ? 'bg-blue-600 text-white' :
            'bg-gray-800 text-gray-400'
          }`}>
            {index + 1}
          </div>
          <span className={`text-xs ${
            step === s ? 'text-white font-medium' : 'text-gray-400'
          }`}>
            {s === "form" ? "Details" : 
             s === "method" ? "Payment" : 
             "Review"}
          </span>
        </div>
      ))}
    </div>
  );

  const ReviewDetails = ({ isViewDetailsMode = false }: { isViewDetailsMode?: boolean }) => {
    const isReviewStep = step === "review" && !isViewDetailsMode;
    const subtotalUSD = calculateSubtotalUSD();
    const taxUSD = calculateTaxUSD();
    const totalUSD = calculateTotalUSD();
    
    const subtotalCurrent = getSubtotalInCurrentCurrency();
    const taxCurrent = getTaxInCurrentCurrency();
    const totalCurrent = getTotalInCurrentCurrency();
    
    const requiresConversion = selectedPaymentMethod === "paystack" && currentCurrency !== 'NGN';
    
    return (
      <div className="space-y-6 pb-4">
        {/* Order Info */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-white text-base">Order Details</h3>
            {isReviewStep && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {selectedPaymentMethod === "whatsapp" ? "WhatsApp" : "Paystack"}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {isReviewStep && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Order #</span>
                <span className="font-mono font-semibold text-white text-xs truncate max-w-[180px]">
                  {generatedOrderNumber}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date</span>
              <span className="font-semibold text-white">
                {new Date().toLocaleDateString("en-US", { 
                  month: "short", 
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>
            {isReviewStep && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment</span>
                <span className="font-semibold text-white flex items-center gap-2">
                  {selectedPaymentMethod === "whatsapp" ? (
                    <>
                      <MessageCircle className="w-4 h-4 text-green-400" />
                      WhatsApp
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      Paystack
                    </>
                  )}
                </span>
              </div>
            )}
            {isReviewStep && requiresConversion && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Currency Conversion</span>
                <span className="font-semibold text-white text-xs">
                  {currentCurrency} → NGN @ {exchangeRate.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info */}
        {(isReviewStep || formData.firstName) && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="font-semibold mb-3 text-white text-base">Customer Details</h3>
            <div className="space-y-2 text-sm">
              {formData.firstName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Name</span>
                  <span className="font-semibold text-white truncate max-w-[180px] text-right">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
              )}
              {formData.email && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="font-semibold text-white truncate max-w-[180px] text-right">
                    {formData.email}
                  </span>
                </div>
              )}
              {formData.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone</span>
                  <span className="font-semibold text-white">{formData.phone}</span>
                </div>
              )}
              {formData.country && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Country</span>
                  <span className="font-semibold text-white">{formData.country}</span>
                </div>
              )}
              {formData.state && (
                <div className="flex justify-between">
                  <span className="text-gray-400">State</span>
                  <span className="font-semibold text-white">{formData.state}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        {isMobile ? (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white text-base">Order Items</h3>
              <span className="text-sm text-gray-400">
                {currentCurrency === 'USD' ? 'USD' : 'NGN'}
              </span>
            </div>
            <div className="space-y-3">
              {cart.slice(0, 2).map((item) => {
                const itemTotalUSD = item.price * item.quantity;
                const itemTotalCurrent = convertAmountToCurrentCurrency(itemTotalUSD);
                
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-400">
                        {getConvertedPrice(itemTotalUSD)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {cart.length > 2 && (
                <div className="text-center pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    + {cart.length - 2} more items
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white text-base">Order Items</h3>
              <span className="text-sm text-gray-400">
                {currentCurrency === 'USD' ? 'Prices in USD' : 'Prices in NGN'}
              </span>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => {
                const itemTotalUSD = item.price * item.quantity;
                
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">x{item.quantity}</p>
                      <p className="text-sm font-bold text-blue-400">
                        {getConvertedPrice(itemTotalUSD)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Total */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <div className="text-right">
                <span className="font-semibold text-white">
                  {getConvertedPrice(subtotalUSD)}
                </span>
                <p className="text-xs text-gray-400">
                  ({subtotalUSD.toFixed(2)} USD)
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax (8%)</span>
              <div className="text-right">
                <span className="font-semibold text-white">
                  {getConvertedPrice(taxUSD)}
                </span>
                <p className="text-xs text-gray-400">
                  ({taxUSD.toFixed(2)} USD)
                </p>
              </div>
            </div>
            
            {isReviewStep && requiresConversion && (
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Converted to NGN</span>
                  <div className="text-right">
                    <span className="font-semibold text-yellow-400">
                      ₦{convertUSDToNGN(totalUSD).toLocaleString('en-NG', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </span>
                    <p className="text-xs text-gray-400">
                      (Exchange rate: {exchangeRate.toFixed(2)})
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <div className="text-right">
                  <span className="text-blue-400">
                    {getConvertedPrice(totalUSD)}
                  </span>
                  {isReviewStep && selectedPaymentMethod === "paystack" && requiresConversion && (
                    <p className="text-xs text-gray-400 mt-1">
                      Will charge: ₦{convertUSDToNGN(totalUSD).toLocaleString('en-NG')}
                    </p>
                  )}
                  {isReviewStep && selectedPaymentMethod === "paystack" && currentCurrency === 'NGN' && (
                    <p className="text-xs text-gray-400 mt-1">
                      Will charge: ₦{Math.round(totalCurrent).toLocaleString('en-NG')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {isViewDetailsMode ? (
            <Button
              type="button"
              onClick={handleCloseViewDetails}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              Close
            </Button>
          ) : isReviewStep ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("method")}
                className="flex-1 border-gray-700 text-white hover:bg-gray-800 h-12"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {selectedPaymentMethod === "paystack" ? (
                <Button
                  onClick={handlePaystackPayment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      {isMobile ? "Pay" : currentCurrency === 'NGN' ? "Pay in NGN" : "Pay Securely"}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleWhatsAppCheckout}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2 h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      {isMobile ? "Send" : "Send via WhatsApp"}
                    </>
                  )}
                </Button>
              )}
            </>
          ) : null}
        </div>

        {isReviewStep && (
          <p className="text-center text-sm text-gray-400 px-2">
            {selectedPaymentMethod === "paystack"
              ? currentCurrency === 'NGN' 
                ? "You'll be redirected to Paystack for secure NGN payment."
                : `Amount will be converted from ${currentCurrency} to NGN and charged in Naira.`
              : "You'll be redirected to WhatsApp to send your order."}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open && !showViewDetails} onOpenChange={handleClose}>
        <DialogContent className={`
          ${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh]' : 'max-w-2xl max-h-[90vh]'} 
          overflow-y-auto bg-gray-900 text-white border border-gray-800 rounded-lg
        `}>
          <DialogHeader className="sticky top-0 bg-gray-900 z-10 pb-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                <div className="flex items-center gap-2">
                  {step === "form" ? (
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  ) : step === "method" ? (
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  )}
                  <span className="text-base sm:text-xl">{getDialogTitle()}</span>
                </div>
              </DialogTitle>
              <Badge className="bg-gray-800 px-3 py-1 text-xs sm:text-sm">
                {currentCurrency === 'USD' ? 'USD ($)' : 'NGN (₦)'}
              </Badge>
            </div>
            {isMobile && <MobileStepIndicator />}
            <p className="text-sm text-gray-400 mt-2">
              {step === "form" 
                ? "Complete your order with secure payment"
                : step === "method"
                ? "Choose how you'd like to complete your order"
                : selectedPaymentMethod === "whatsapp"
                ? "Review your order before sending via WhatsApp"
                : "Review your order before payment"}
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 sm:px-0">
            {step === "form" ? (
              <>
                {isMobile && (
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">Order Total</p>
                        <p className="text-xl font-bold text-white">
                          {getConvertedPrice(calculateTotalUSD())}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{cart.length} items</p>
                        <button 
                          onClick={handleViewDetails}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!isMobile && (
                  <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-white">Order Summary</h3>
                      <span className="text-sm text-gray-400">
                        {currentCurrency === 'USD' ? 'USD' : 'NGN'}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {cart.map((item) => {
                        const itemTotalUSD = item.price * item.quantity;
                        
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-white truncate max-w-[200px]">
                              {item.name} x {item.quantity}
                            </span>
                            <div className="text-right">
                              <span className="font-medium text-white">
                                {getConvertedPrice(itemTotalUSD)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between font-bold text-lg">
                      <span className="text-white">Total:</span>
                      <div className="text-right">
                        <span className="text-blue-400">
                          {getConvertedPrice(calculateTotalUSD())}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleViewDetails}
                        className="w-full border-gray-700 text-white hover:bg-gray-800"
                      >
                        View Full Order Details
                      </Button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white text-sm sm:text-base">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="pl-10 bg-gray-800 text-white border-gray-700 placeholder-gray-400 h-12"
                          required
                          disabled={isLoading}
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white text-sm sm:text-base">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="pl-10 bg-gray-800 text-white border-gray-700 placeholder-gray-400 h-12"
                          required
                          disabled={isLoading}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-sm sm:text-base">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10 bg-gray-800 text-white border-gray-700 placeholder-gray-400 h-12"
                          required
                          disabled={isLoading}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white text-sm sm:text-base">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10 bg-gray-800 text-white border-gray-700 placeholder-gray-400 h-12"
                          placeholder="2348012345678"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        For order confirmation and updates
                      </p>
                    </div>
                  </div>

                  <CountrySelector />

                  {formData.country === "Nigeria" && (
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white text-sm sm:text-base">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-10 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                          required
                          disabled={isLoading}
                        >
                          <option value="">Select a state</option>
                          {NIGERIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {!isMobile && (
                    <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-300 text-sm sm:text-base">Secure Checkout Process:</h4>
                          <ul className="text-sm text-gray-300 mt-2 space-y-1">
                            <li>• Fill in your details above</li>
                            <li>• Choose payment method (Paystack or WhatsApp)</li>
                            <li>• Review your order details</li>
                            {currentCurrency === 'USD' && (
                              <li>• USD amounts will be converted to NGN for Paystack payment</li>
                            )}
                            <li>• Complete payment securely</li>
                            <li>• Receive order confirmation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {isMobile && (
                    <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-300">
                        <span className="font-semibold">Next:</span> Choose payment method
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1 border-gray-700 text-white hover:bg-gray-800 h-12"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Continue
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : step === "method" ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Choose Payment Method</h3>
                  <p className="text-gray-400 text-sm">Select how you'd like to complete your purchase</p>
                </div>

                <div className="space-y-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "paystack" 
                        ? "border-blue-500 bg-blue-900/20" 
                        : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                    }`}
                    onClick={() => handleSelectPaymentMethod("paystack")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        <CreditCard className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-base">Pay with Paystack</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Secure online payment with cards, bank transfer, or USSD
                        </p>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-300">Instant payment confirmation</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-300">Secure & encrypted</span>
                          </div>
                          {currentCurrency !== 'NGN' && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-300">Converts {currentCurrency} to NGN automatically</span>
                            </div>
                          )}
                          {currentCurrency === 'NGN' && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-300">Pay directly in NGN without conversion</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedPaymentMethod === "paystack" && (
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                  </div>

                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "whatsapp" 
                        ? "border-green-500 bg-green-900/20" 
                        : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                    }`}
                    onClick={() => handleSelectPaymentMethod("whatsapp")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-900/30 rounded-lg">
                        <MessageCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-base">Order via WhatsApp</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Send your order via WhatsApp and pay directly with the business
                        </p>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-300">Direct communication</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-300">Flexible payment options</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-300">Personalized service</span>
                          </div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "whatsapp" && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 text-base">Order Summary</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">{cart.length} items</p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">
                          Order: {generatedOrderNumber}
                        </p>
                        {currentCurrency !== 'NGN' && (
                          <p className="text-xs text-yellow-400 mt-1">
                            Will be converted from {currentCurrency} to NGN for Paystack
                          </p>
                        )}
                        {currentCurrency === 'NGN' && (
                          <p className="text-xs text-green-400 mt-1">
                            Will be processed directly in NGN
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-400">
                          {getConvertedPrice(calculateTotalUSD())}
                        </p>
                        {currentCurrency !== 'NGN' && (
                          <p className="text-xs text-gray-400">
                            ≈ ₦{convertUSDToNGN(calculateTotalUSD()).toLocaleString('en-NG')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800 h-12"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
                    disabled={!selectedPaymentMethod}
                    onClick={() => selectedPaymentMethod && setStep("review")}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <ReviewDetails />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDetails} onOpenChange={handleCloseViewDetails}>
        <DialogContent className={`
          ${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh]' : 'max-w-2xl max-h-[90vh]'} 
          overflow-y-auto bg-gray-900 text-white border border-gray-800 rounded-lg
        `}>
          <DialogHeader className="sticky top-0 bg-gray-900 z-10 pb-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  <span className="text-base sm:text-xl">Order Details</span>
                </div>
              </DialogTitle>
              <Badge className="bg-gray-800 px-3 py-1 text-xs sm:text-sm">
                {currentCurrency === 'USD' ? 'USD ($)' : 'NGN (₦)'}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Review your order details before proceeding to payment
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 sm:px-0">
            <ReviewDetails isViewDetailsMode={true} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};