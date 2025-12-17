import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Make sure this is imported
import type { Product } from "../types/product";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ShoppingCart, ImageOff } from "lucide-react";
import { cn } from "../lib/utils"; 
import { useCurrency } from "../context/CurrencyContext"; 

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export const ProductCard = ({ product, onAddToCart, className }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  // Hook into the context to get the converter function
  const { getConvertedPrice } = useCurrency();

  const handleProductClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on the Add to Cart button
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onAddToCart(product);
  };

  return (
    <Card 
      onClick={handleProductClick}
      className={cn(
        "group overflow-hidden bg-[#081748] border-border transition-all duration-300 cursor-pointer hover:shadow-lg",
        "hover:border-primary/50 hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="aspect-video overflow-hidden bg-muted relative">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/20 text-muted-foreground">
            <ImageOff className="h-10 w-10 opacity-50" />
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-[10px] px-2">
              {product.category}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {product.description}
          </p>
        </div>

        <div className="min-h-[3rem]"> 
            {product.specifications && (
            <ul className="text-xs text-muted-foreground space-y-1">
                {product.specifications.slice(0, 2).map((spec, idx) => (
                <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                    <span className="truncate">{spec}</span>
                </li>
                ))}
            </ul>
            )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            {/* Price section updated to use Context */}
            <p className="text-2xl font-bold text-primary">
              {getConvertedPrice(product.price)}
            </p>
            <p className={cn(
                "text-xs font-medium",
                product.inStock ? "text-green-500" : "text-destructive"
            )}>
              {product.inStock ? "In Stock" : "Unavailable"}
            </p>
          </div>

          <Button
            onClick={handleAddToCartClick}
            disabled={!product.inStock}
            size="sm"
            className="gap-2 transition-transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? "Add" : "Out"}
          </Button>
        </div>
      </div>
    </Card>
  );
};