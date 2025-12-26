import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { products, categories, getProductById } = useProducts();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = getProductById(id);
    if (foundProduct) {
      setProduct(foundProduct);
      // Scroll to top when product changes
      window.scrollTo(0, 0);
    } else {
      navigate("/products");
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added to cart: ${quantity}x ${product.name}`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-5 w-5 text-yellow-400 fill-current opacity-30"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  // Getting related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Multiple product images (for demo, we'll use variations of the same image)
  const productImages = [
    product.image,
    product.image + "&sat=150",
    product.image + "&hue=80",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-rose-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to products
        </button>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-rose-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category and Wishlist */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                {product.category}
              </Badge>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isLiked ? "text-rose-500 fill-current" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              Kes&nbsp;{product.price}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                size="lg"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 text-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center p-4">
                <Truck className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                <div className="text-sm font-medium">Free Shipping</div>
                <div className="text-xs text-gray-500">
                  Orders over kes 1500
                </div>
              </div>
              <div className="text-center p-4">
                <RotateCcw className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                <div className="text-sm font-medium">30-Day Returns</div>
                <div className="text-xs text-gray-500">Hassle free</div>
              </div>
              <div className="text-center p-4">
                <Shield className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                <div className="text-sm font-medium">Secure Payment</div>
                <div className="text-xs text-gray-500">SSL encrypted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>

              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Premium quality ingredients</li>
                  <li>• Suitable for all skin types</li>
                  <li>• Dermatologist tested</li>
                  <li>• Cruelty-free </li>
                  <li>• Made in Kenya</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {/* Sample Reviews */}
                  <div className="border-b pb-6">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">{renderStars(5)}</div>
                      <span className="font-medium">Sarah M.</span>
                      <span className="text-sm text-gray-500">
                        Verified Purchase
                      </span>
                    </div>
                    <p className="text-gray-600">
                      "Absolutely love this product! My skin feels so much
                      smoother and looks more radiant. Will definitely
                      repurchase."
                    </p>
                  </div>

                  <div className="border-b pb-6">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">{renderStars(4)}</div>
                      <span className="font-medium">Jennifer L.</span>
                      <span className="text-sm text-gray-500">
                        Verified Purchase
                      </span>
                    </div>
                    <p className="text-gray-600">
                      "Great quality product. Noticed improvements in my skin
                      texture within a week of use. Highly recommend!"
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
