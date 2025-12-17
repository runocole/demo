// src/pages/ProductDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Share2, 
  Heart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Image as ImageIcon
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate("/buynow")}
              className="text-gray-600 hover:text-gray-900"
            >
              Shop
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate(`/buynow?category=${product.category}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              {product.category}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index 
                      ? 'border-[#081748] ' 
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
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.2 (12 reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-1" />
                  In Stock
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-[#081748]  rounded-xl p-6">
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-4xl font-bold text-blue-600">
                  {getConvertedPrice(product.price)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {getConvertedPrice(product.price * 1.2)}
                </span>
                <Badge className="bg-red-100 text-red-600">Save 20%</Badge>
              </div>
              <p className="text-gray-600">Including VAT</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {product.inStock ? (
                    <span className="text-green-600">✓ Available</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
                className="flex-1 bg-[#081748] hover:bg-blue-700 text-white"
                onClick={() => {
                  handleAddToCart();
                  navigate("/cart");
                }}
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsFavorite(!isFavorite)}
                className="border border-gray-300"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleShare}
                className="border border-gray-300"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">30-Day Returns</h4>
                  <p className="text-sm text-gray-600">No questions asked</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">2-Year Warranty</h4>
                  <p className="text-sm text-gray-600">Full coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details, Specs, Reviews */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (12)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              <p className="text-gray-700 leading-relaxed">
                This premium survey equipment offers unparalleled accuracy and durability for 
                professional surveying applications. Built with state-of-the-art technology, 
                it ensures reliable performance in the most challenging environments.
              </p>
            </TabsContent>
            
            <TabsContent value="specifications">
              <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications?.map((spec, index) => (
                    <div key={index} className="py-3 border-b border-gray-200 last:border-0">
                      <dt className="font-semibold text-gray-900">
                        {spec.split(':')[0]}
                      </dt>
                      <dd className="text-gray-600 mt-1">
                        {spec.split(':').slice(1).join(':').trim() || spec}
                      </dd>
                    </div>
                  )) || (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      No specifications available
                    </div>
                  )}
                </dl>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
              {/* Reviews would go here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
      <CurrencyBoxes />
    </div>
  );
};

export default ProductDetailPage;