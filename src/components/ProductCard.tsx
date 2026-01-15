import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ImageOff, Info, Eye, ShoppingCart } from "lucide-react";
import { cn } from "../lib/utils"; 
import { useCurrency } from "../context/CurrencyContext"; 
import { useToast } from "../hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
  variant?: "default" | "split" | "compact";
  showQuickView?: boolean;
}

export const ProductCard = ({ 
  product, 
  className,
  variant = "default",
  showQuickView = false
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Track screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define screen categories based on Header component
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isCompactDesktop = screenSize.width >= 1024 && screenSize.width < 1280;
  const isDesktop = screenSize.width >= 1280 && screenSize.width < 1645;
  const isLargeDesktop = screenSize.width >= 1645;

  const { getConvertedPrice } = useCurrency();

  const handleProductClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigate(`/product/${product.id}`);
    
    toast({
      title: "View Product Details",
      description: `You're viewing ${product.name} details`,
      className: "bg-white dark:bg-gray-900",
    });
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  // Determine styles based on variant and screen size
  const isSplitVariant = variant === "split";
  
  // Get products per row based on screen size (IMPORTANT FOR SPACING)
  const getProductsPerRow = () => {
    if (isMobile) return 1; // 1 product per row on mobile
    if (isTablet) return 2; // 2 products per row on tablet
    if (isCompactDesktop) return 3; // 3 products per row on compact desktop
    if (isDesktop) return 4; // 4 products per row on desktop
    return 5; // 5 products per row on large desktop
  };

  // Responsive dimensions based on screen size with perfect spacing
  const getResponsiveStyles = () => {
    const productsPerRow = getProductsPerRow();
    
    switch (productsPerRow) {
      case 1: // Mobile
        return {
          card: "shadow-md hover:shadow-lg w-full",
          padding: "p-4",
          titleSize: "text-base font-semibold",
          priceSize: "text-lg font-bold",
          buttonSize: "h-10 px-4 text-sm",
          imageHeight: "h-52",
          descriptionLines: 2,
          showSpecs: false,
          buttonText: true,
          iconSize: "w-4 h-4",
          gap: "gap-4",
          showCategoryBadge: false,
          showStockAlways: true,
          buttonFullWidth: true
        };
      
      case 2: // Tablet
        return {
          card: "shadow-lg hover:shadow-xl w-full",
          padding: "p-4",
          titleSize: "text-base font-semibold",
          priceSize: "text-xl font-bold",
          buttonSize: "h-10 px-4 text-sm",
          imageHeight: "h-56",
          descriptionLines: 2,
          showSpecs: false,
          buttonText: true,
          iconSize: "w-4 h-4",
          gap: "gap-4",
          showCategoryBadge: true,
          showStockAlways: true,
          buttonFullWidth: false
        };
      
      case 3: // Compact Desktop
        return {
          card: "shadow-lg hover:shadow-xl w-full",
          padding: "p-4",
          titleSize: "text-sm font-semibold",
          priceSize: "text-lg font-bold",
          buttonSize: "h-9 px-3 text-sm",
          imageHeight: "h-48",
          descriptionLines: 2,
          showSpecs: true,
          buttonText: false,
          iconSize: "w-3.5 h-3.5",
          gap: "gap-3",
          showCategoryBadge: true,
          showStockAlways: true,
          buttonFullWidth: false
        };
      
      case 4: // Desktop
        return {
          card: "shadow-lg hover:shadow-2xl w-full",
          padding: "p-5",
          titleSize: "text-base font-semibold",
          priceSize: "text-xl font-bold",
          buttonSize: "h-10 px-4 text-sm",
          imageHeight: "h-52",
          descriptionLines: 3,
          showSpecs: true,
          buttonText: true,
          iconSize: "w-4 h-4",
          gap: "gap-4",
          showCategoryBadge: true,
          showStockAlways: false,
          buttonFullWidth: false
        };
      
      case 5: // Large Desktop
        return {
          card: "shadow-xl hover:shadow-2xl w-full",
          padding: "p-6",
          titleSize: "text-lg font-semibold",
          priceSize: "text-2xl font-bold",
          buttonSize: "h-11 px-5 text-base",
          imageHeight: "h-60",
          descriptionLines: 3,
          showSpecs: true,
          buttonText: true,
          iconSize: "w-5 h-5",
          gap: "gap-5",
          showCategoryBadge: true,
          showStockAlways: false,
          buttonFullWidth: false
        };
      
      default:
        return {
          card: "shadow-lg hover:shadow-xl w-full",
          padding: "p-4",
          titleSize: "text-base font-semibold",
          priceSize: "text-xl font-bold",
          buttonSize: "h-10 px-4 text-sm",
          imageHeight: "h-56",
          descriptionLines: 2,
          showSpecs: true,
          buttonText: true,
          iconSize: "w-4 h-4",
          gap: "gap-4",
          showCategoryBadge: true,
          showStockAlways: false,
          buttonFullWidth: false
        };
    }
  };

  const styles = getResponsiveStyles();

  // Theme colors based on variant
  const cardBgColor = isSplitVariant ? "" : "bg-white";
  const contentBgColor = isSplitVariant ? "bg-[#081748]" : "bg-transparent";
  const titleColor = isSplitVariant ? "text-white" : "text-gray-900";
  const descriptionColor = isSplitVariant ? "text-gray-300" : "text-gray-600";
  const specColor = isSplitVariant ? "text-gray-400" : "text-gray-500";
  const priceColor = isSplitVariant ? "text-white" : "text-[#081748]";
  const borderColor = isSplitVariant ? "border-gray-700" : "border-gray-200";
  
  const buttonClass = isSplitVariant 
    ? "bg-white text-[#081748] hover:bg-gray-100 active:scale-95" 
    : "bg-[#081748] hover:bg-[#0a1f5a] text-white active:scale-95";
  
  const badgeClass = isSplitVariant 
    ? "bg-gray-700 text-white" 
    : "bg-[#081748]/10 text-[#081748]";

  // Main render function with consistent layout
  return (
    <Card 
      onClick={handleProductClick}
      className={cn(
        "group overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col",
        cardBgColor,
        borderColor,
        styles.card,
        "hover:border-blue-300 hover:transform hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Image section - Fixed aspect ratio */}
      <div className={`relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center`}>
        {!imageError ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Quick view overlay */}
            {isHovered && !isMobile && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <Button
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100 z-20"
                  onClick={handleQuickViewClick}
                  type="button"
                >
                  <Eye className={`${styles.iconSize} mr-2`} />
                  Quick View
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className={cn(
            "flex h-full w-full items-center justify-center text-muted-foreground p-4",
            isSplitVariant ? "bg-gray-800" : "bg-gray-100"
          )}>
            <ImageOff className="h-12 w-12 opacity-50" />
          </div>
        )}
        
        {/* Stock badge - Always visible */}
        <Badge 
          className={cn(
            "absolute top-2 left-2 text-xs px-2 py-1 z-10",
            product.inStock 
              ? "bg-green-100 text-green-800 border-green-200" 
              : "bg-red-100 text-red-800 border-red-200"
          )}
        >
          {product.inStock ? "In Stock" : "Out"}
        </Badge>
        
        {/* Category badge - Conditional */}
        {styles.showCategoryBadge && (
          <Badge 
            variant="secondary"
            className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-[#081748] text-white border-0 z-10"
          >
            {product.category.length > 12 ? `${product.category.substring(0, 12)}...` : product.category}
          </Badge>
        )}
      </div>

      {/* Content section with perfect spacing */}
      <div className={cn(
        styles.padding, 
        "flex flex-col flex-1", 
        contentBgColor,
        styles.gap
      )}>
        {/* Title and Price Row */}
        <div className="space-y-2">
          <h3 className={cn(
            "leading-tight line-clamp-2 min-h-[2.5rem]",
            styles.titleSize,
            titleColor
          )}>
            {product.name}
          </h3>
          
          {/* Price - ALWAYS VISIBLE */}
          <div className="flex items-center justify-between">
            <p className={cn(styles.priceSize, priceColor)}>
              {getConvertedPrice(product.price)}
            </p>
            
            {/* Stock status - Conditional */}
            {styles.showStockAlways && (
              <span className={cn(
                "text-xs font-medium",
                product.inStock 
                  ? (isSplitVariant ? "text-green-400" : "text-green-600") 
                  : (isSplitVariant ? "text-red-400" : "text-red-600")
              )}>
                {product.inStock ? "✓ Available" : "✗ Unavailable"}
              </span>
            )}
          </div>
        </div>

        {/* Description - With proper line clamping */}
        <div className="flex-1">
          <p className={cn(
            "line-clamp-2 text-sm",
            descriptionColor
          )}>
            {product.description}
          </p>
        </div>

        {/* Specifications - Only for larger screens */}
        {styles.showSpecs && product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
          <div className="space-y-1">
            <ul className={cn("text-xs space-y-1", specColor)}>
              {product.specifications.slice(0, 2).map((spec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#081748] shrink-0 mt-1"></span>
                  <span className="line-clamp-1">
                    {spec}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className={cn(
          "pt-2 border-t",
          borderColor,
          styles.buttonFullWidth ? "space-y-2" : ""
        )}>
          {/* Quick view button for mobile */}
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-sm text-[#081748] hover:text-[#0a1f5a] hover:bg-[#081748]/10 border-gray-300"
              onClick={handleQuickViewClick}
              type="button"
            >
              <Info className={`${styles.iconSize} mr-2`} />
              View Details
            </Button>
          )}
          
          {/* Main Action Button */}
          <div className={cn(
            "flex items-center gap-2",
            styles.buttonFullWidth ? "flex-col" : "justify-between"
          )}>
            {/* Quick view button for desktop */}
            {showQuickView && !isMobile && !isTablet && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "border-gray-300 text-[#081748] hover:bg-[#081748]/10 hover:text-[#0a1f5a]",
                  styles.buttonFullWidth ? "w-full" : ""
                )}
                onClick={handleQuickViewClick}
                type="button"
              >
                <Eye className={`${styles.iconSize} mr-1`} />
                Quick View
              </Button>
            )}
            
            {/* Main View/Add to Cart Button */}
            <Button
              onClick={handleAddToCartClick}
              disabled={!product.inStock}
              size={styles.buttonFullWidth ? "default" : "sm"}
              className={cn(
                "gap-2 transition-all hover:bg-[#0a1f5a]",
                buttonClass,
                styles.buttonSize,
                styles.buttonFullWidth ? "w-full" : "",
                !product.inStock && "bg-gray-400 hover:bg-gray-500 cursor-not-allowed opacity-75"
              )}
              title="View Product Details"
              type="button"
            >
              <Info className={styles.iconSize} />
              {styles.buttonText ? "View Details" : "View"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};