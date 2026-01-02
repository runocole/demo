import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ShoppingCart, ImageOff, Info, Eye } from "lucide-react";
import { cn } from "../lib/utils"; 
import { useCurrency } from "../context/CurrencyContext"; 

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
  variant?: "default" | "split" | "compact"; // Add compact variant for mobile
  showQuickView?: boolean;
}

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  className,
  variant = "default",
  showQuickView = false
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hook into the context to get the converter function
  const { getConvertedPrice } = useCurrency();

  const handleProductClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on interactive elements
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onAddToCart(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  // Determine styles based on variant
  const isSplitVariant = variant === "split";
  const isCompactVariant = variant === "compact" || isMobile;
  
  // UPDATED: Using #081748 for button and price colors
  const cardBgColor = isSplitVariant ? "" : "bg-white";
  const contentBgColor = isSplitVariant ? "bg-[#081748]" : "bg-transparent";
  const titleColor = isSplitVariant ? "text-white" : "text-gray-900";
  const descriptionColor = isSplitVariant ? "text-gray-300" : "text-gray-600";
  const specColor = isSplitVariant ? "text-gray-400" : "text-gray-500";
  const priceColor = isSplitVariant ? "text-white" : "text-[#081748]"; // CHANGED to #081748
  const stockColorClass = product.inStock 
    ? (isSplitVariant ? "text-green-400" : "text-green-600") 
    : (isSplitVariant ? "text-red-400" : "text-red-600");
  const badgeVariant = isSplitVariant ? "secondary" : "outline";
  const badgeClass = isSplitVariant ? "bg-gray-700 text-white" : "bg-[#081748]/10 text-[#081748]"; // CHANGED
  const buttonClass = isSplitVariant 
    ? "bg-white text-[#081748] hover:bg-gray-100 active:scale-95" 
    : "bg-[#081748] hover:bg-[#0a1f5a] text-white active:scale-95"; // CHANGED to #081748
  const borderColor = isSplitVariant ? "border-gray-700" : "border-gray-200";
  
  // Mobile-specific styles
  const mobileCardClass = isMobile ? "shadow-sm hover:shadow-md" : "shadow-md hover:shadow-lg";
  const mobilePadding = isMobile ? "p-3" : "p-5";
  const mobileTitleSize = isMobile ? "text-base" : "text-lg";
  const mobilePriceSize = isMobile ? "text-xl" : "text-2xl";
  const mobileButtonSize = isMobile ? "px-2 py-1 text-xs h-8" : "px-4 py-2 text-sm h-9";
  const mobileImageHeight = isMobile ? "h-48" : "h-56";

  // Compact variant adjustments
  if (isCompactVariant) {
    return (
      <Card 
        onClick={handleProductClick}
        className={cn(
          "group overflow-hidden border transition-all duration-300 cursor-pointer",
          cardBgColor,
          borderColor,
          mobileCardClass,
          "relative",
          className
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Image section */}
        <div className={`relative ${mobileImageHeight} overflow-hidden bg-gray-50 flex items-center justify-center p-3`}>
          {!imageError ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-auto h-auto max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Quick view overlay - Desktop only */}
              {!isMobile && isHovered && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                    onClick={handleQuickViewClick}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Quick View
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              <ImageOff className="h-8 w-8 opacity-50" />
            </div>
          )}
          
          {/* Stock badge */}
          <Badge 
            className={cn(
              "absolute top-2 left-2 text-xs px-2 py-0.5",
              product.inStock 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-red-100 text-red-800 border-red-200"
            )}
          >
            {product.inStock ? "In Stock" : "Out"}
          </Badge>
          
          {/* Category badge */}
          <Badge 
            variant="secondary"
            className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-[#081748] text-white border-0" // CHANGED
          >
            {product.category.length > 12 ? `${product.category.substring(0, 12)}...` : product.category}
          </Badge>
        </div>

        {/* Content section */}
        <div className={cn("p-3 space-y-2", contentBgColor)}>
          {/* Title */}
          <h3 className={cn(
            "font-semibold leading-tight line-clamp-2 h-10",
            mobileTitleSize,
            titleColor
          )}>
            {product.name}
          </h3>

          {/* Price and action */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className={cn("font-bold", mobilePriceSize, priceColor)}>
                {getConvertedPrice(product.price)}
              </p>
              {!isMobile && (
                <p className="text-xs text-gray-500">
                  {product.inStock ? "✓ Available" : "✗ Unavailable"}
                </p>
              )}
            </div>

            <Button
              onClick={handleAddToCartClick}
              disabled={!product.inStock}
              size={isMobile ? "icon" : "default"}
              className={cn(
                "gap-1 transition-all hover:bg-[#0a1f5a]", // CHANGED hover color
                buttonClass,
                mobileButtonSize,
                isMobile && "rounded-full",
                !product.inStock && "bg-gray-400 hover:bg-gray-500" // Added disabled state
              )}
              title={isMobile ? "Add to cart" : undefined}
            >
              {isMobile ? (
                <ShoppingCart className="w-4 h-4" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add 
                </>
              )}
            </Button>
          </div>
          
          {/* Quick view button - Mobile only */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-[#081748] hover:text-[#0a1f5a] hover:bg-[#081748]/10" // CHANGED
              onClick={handleQuickViewClick}
            >
              <Info className="w-3 h-3 mr-1" />
              View Details
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Default/Split variant (for desktop)
  return (
    <Card 
      onClick={handleProductClick}
      className={cn(
        "group overflow-hidden border transition-all duration-300 cursor-pointer",
        cardBgColor,
        borderColor,
        "hover:border-blue-300 hover:shadow-xl",
        mobileCardClass,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image section */}
      <div className={`aspect-video overflow-hidden bg-gray-50 relative flex items-center justify-center p-4 ${mobileImageHeight}`}>
        {!imageError ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-auto h-auto max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Quick view overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={handleQuickViewClick}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Quick View
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className={cn(
            "flex h-full w-full items-center justify-center text-muted-foreground",
            isSplitVariant ? "bg-gray-800" : "bg-gray-100"
          )}>
            <ImageOff className="h-10 w-10 opacity-50" />
          </div>
        )}
        
        {/* Stock badge */}
        {isHovered && (
          <Badge 
            className={cn(
              "absolute top-3 left-3 text-xs px-2 py-1",
              product.inStock 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-red-100 text-red-800 border-red-200"
            )}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        )}
      </div>

      {/* Content section */}
      <div className={cn(mobilePadding, "space-y-4", contentBgColor)}>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-semibold leading-tight group-hover:text-[#081748] transition-colors line-clamp-1", // CHANGED hover color
              mobileTitleSize,
              titleColor
            )}>
              {product.name}
            </h3>
            <Badge 
              variant={badgeVariant} 
              className={cn("shrink-0 text-[10px] px-2 py-0.5", badgeClass)}
            >
              {product.category.length > 15 ? `${product.category.substring(0, 15)}...` : product.category}
            </Badge>
          </div>
          
          <p className={cn("text-sm line-clamp-2 h-10", descriptionColor)}>
            {product.description}
          </p>
        </div>

        {/* Specifications section */}
        {!isMobile && product.specifications && Array.isArray(product.specifications) && (
          <div className="min-h-[3rem]"> 
            <ul className={cn("text-xs space-y-1", specColor)}>
              {product.specifications.slice(0, 2).map((spec, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#081748] shrink-0"></span> {/* CHANGED */}
                  <span className="truncate">{spec.length > 50 ? `${spec.substring(0, 50)}...` : spec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={cn("flex items-center justify-between pt-3 border-t", borderColor)}>
          <div>
            <p className={cn("font-bold", mobilePriceSize, priceColor)}>
              {getConvertedPrice(product.price)}
            </p>
            <p className={cn("text-xs font-medium", stockColorClass)}>
              {product.inStock ? "✓ In Stock" : "✗ Unavailable"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {showQuickView && (
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex text-xs border-gray-300 text-[#081748] hover:bg-[#081748]/10 hover:text-[#0a1f5a]" // CHANGED
                onClick={handleQuickViewClick}
              >
                <Info className="w-3 h-3 mr-1" />
                Details
              </Button>
            )}
            <Button
              onClick={handleAddToCartClick}
              disabled={!product.inStock}
              size={isMobile ? "icon" : "sm"}
              className={cn(
                "gap-2 transition-all hover:bg-[#0a1f5a]", // CHANGED hover color
                buttonClass,
                mobileButtonSize,
                !product.inStock && "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" // Added disabled state
              )}
              title={isMobile ? "Add to cart" : undefined}
            >
              <ShoppingCart className="w-4 h-4" />
              {!isMobile && (product.inStock ? "Add to Cart" : "Out of Stock")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};