import type { Product } from "../types/product";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
   <Card className="group overflow-hidden bg-[#081748] border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-hover)]">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {product.category}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {product.specifications && (
          <ul className="text-xs text-muted-foreground space-y-1">
            {product.specifications.slice(0, 2).map((spec, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary"></span>
                {spec}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            size="sm"
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};
