import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product, showBestSellerBadge = false }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added to basket: 1x ${product.name}`);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 text-yellow-400 fill-current opacity-50"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted/30" />);
    }

    return stars;
  };

  return (
    <div className="group relative bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {showBestSellerBadge && (
          <span className="bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Best Seller
          </span>
        )}
        {!product.inStock && (
          <span className="bg-muted-foreground text-white text-xs font-medium px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleLike}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-card rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isLiked ? "text-rose-500 fill-current" : "text-muted-foreground"
          }`}
        />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          )}

          {imageError ? (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-muted-foreground text-sm text-center px-4">
                <div className="mb-2">📷</div>
                <div>Image not available</div>
              </div>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs font-medium text-rose-600 uppercase tracking-wide mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            {/* Price */}
            <div className="text-xl font-bold text-foreground">
              Kes&nbsp;{product.price}
            </div>

            {/* Add to Basket Button */}
            <Button
              onClick={handleAddToCart}
              size="icon"
              variant="outline"
              className="hover:bg-rose-600 hover:text-white text-foreground bg-rose-200 dark:bg-rose-500 dark:text-white dark:border-rose-500 cursor-pointer border-rose-200 transition-colors duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;