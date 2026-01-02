import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Share2, 
  Heart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ArrowLeft,
  ChevronRight,
  Home
} from "lucide-react";
import { PRODUCTS } from "../data/product";
import type { Product } from "../types/product";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CurrencyBoxes from "../components/CurrencyBoxes";
import { useCurrency } from "../context/CurrencyContext";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getConvertedPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Find product by ID
    const foundProduct = PRODUCTS.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      // If product has multiple images, use first as default
      if (foundProduct.images && foundProduct.images.length > 0) {
        setSelectedImage(0);
      }
    }
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to cart`,
      className: "bg-white dark:bg-gray-900",
    });
    
    if (isMobile) {
      setMobileActionsOpen(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
        className: "bg-white dark:bg-gray-900",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/buynow")}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock additional images for demonstration
  const productImages = product.images || [
    product.image,
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w-800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop",
  ];

  // Mobile optimized breadcrumb
  const MobileBreadcrumb = () => (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1 px-4">
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/buynow")}
              className="text-gray-600 hover:text-gray-900 truncate max-w-[100px]"
            >
              Shop
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-[120px]">
              {product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}
            </span>
          </nav>
        </div>
        
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb - Desktop */}
      {!isMobile && (
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => navigate("/buynow")}
                className="text-gray-600 hover:text-gray-900"
              >
                Shop
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => navigate(`/buynow?category=${product.category}`)}
                className="text-gray-600 hover:text-gray-900"
              >
                {product.category}
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {product.name}
              </span>
            </nav>
          </div>
        </div>
      )}

      {/* Breadcrumb - Mobile */}
      {isMobile && <MobileBreadcrumb />}

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4 md:p-8"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2 sm:gap-3">
              {productImages.slice(0, isMobile ? 4 : productImages.length).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index 
                      ? 'border-blue-600' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 text-xs sm:text-sm">{product.category}</Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.2 (12 reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                  <span>In Stock • SKU: {product.id}</span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                  {getConvertedPrice(product.price)}
                </span>
                <span className="text-base sm:text-lg text-gray-500 line-through">
                  {getConvertedPrice(product.price * 1.2)}
                </span>
                <Badge className="bg-red-100 text-red-600 text-xs sm:text-sm">
                  Save 20%
                </Badge>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Including VAT</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Quantity</h3>
              <div className="flex items-center justify-between sm:justify-start sm:space-x-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 sm:p-3 hover:bg-gray-100 disabled:opacity-50"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 sm:px-6 py-2 sm:py-3 text-lg font-semibold min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 sm:p-3 hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {product.inStock ? (
                    <span className="text-green-600 font-medium">✓ Available</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            {!isMobile && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-[#081748] hover:bg-blue-700 text-white"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Buy Now
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="border border-gray-300"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleShare}
                  className="border border-gray-300"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">Free Shipping</h4>
                  <p className="text-xs sm:text-sm text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">30-Day Returns</h4>
                  <p className="text-xs sm:text-sm text-gray-600">No questions asked</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">2-Year Warranty</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Full coverage</p>
                </div>
              </div>
            </div>

            {/* Product Description Preview */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Overview</h3>
              <p className="text-gray-700 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for Details and Specifications */}
        <div className="mt-8 sm:mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger value="description" className="text-sm sm:text-base">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-sm sm:text-base">
                Specifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <div className="bg-white rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">{product.description}</p>
                
                {/* Brand and Model Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {product.brand && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Brand Information</h4>
                      <p className="text-gray-700">Brand: {product.brand}</p>
                      {product.model && <p className="text-gray-700">Model: {product.model}</p>}
                      {product.warranty && <p className="text-gray-700">Warranty: {product.warranty}</p>}
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
                    <p className="text-gray-700">Category: {product.category}</p>
                    <p className="text-gray-700">SKU: {product.id}</p>
                    <p className="text-gray-700">Availability: {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                </div>
                
                {/* Key Features Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.slice(0, 6).map((spec, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications">
              <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="space-y-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex items-start py-3 border-b border-gray-200 last:border-0">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">{spec}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No specifications available for this product.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile Actions Bottom Sheet */}
      {isMobile && (
        <div className="lg:hidden">
          <Sheet open={mobileActionsOpen} onOpenChange={setMobileActionsOpen}>
            <SheetTrigger asChild>
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {getConvertedPrice(product.price * quantity)}
                      </p>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-[#081748] hover:bg-blue-700 text-white"
                      onClick={() => setMobileActionsOpen(true)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-white border-gray-200 text-gray-900 rounded-t-2xl h-[50vh]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Add to Cart</h3>
                  <button
                    onClick={() => setMobileActionsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6 flex-1">
                  {/* Quantity Selector */}
                  <div>
                    <h4 className="font-semibold mb-3">Quantity</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={decrementQuantity}
                          className="p-3 hover:bg-gray-100 disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-3 text-lg font-semibold min-w-[60px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={incrementQuantity}
                          className="p-3 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-blue-600 font-bold text-lg">
                        {getConvertedPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart ({quantity})
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <Footer />
      
      {/* Currency Boxes - Mobile Optimized */}
      <div className={`${isMobile ? 'px-3 py-2' : ''}`}>
        <CurrencyBoxes />
      </div>

      {/* Mobile bottom spacing for actions bar */}
      {isMobile && <div className="h-20" />}
    </div>
  );
};

export default ProductDetailPage;