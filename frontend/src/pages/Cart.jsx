import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white cursor-pointer">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>
          <Link to="/products">
            <Button
              variant="outline"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-rose-950/20 rounded-lg p-6 shadow-sm border border-border transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      <Link
                        to={`/product/${item.id}`}
                        className="hover:text-rose-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.category}
                    </p>
                    <div className="text-lg font-bold text-foreground mt-1">
                      Ksh {item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-muted transition-colors cursor-pointer text-foreground"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-muted transition-colors cursor-pointer text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="font-bold text-foreground">
                      Ksh {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border sticky top-4">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    Ksh&nbsp;{getCartTotal().toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">
                    {getCartTotal() >= 1500 ? "FREE" : "ksh 150"}
                  </span>
                </div>

                <hr className="my-4 border-border" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>
                    Ksh&nbsp;
                    {(
                      getCartTotal() + (getCartTotal() >= 1500 ? 0 : 150)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {getCartTotal() < 1500 && (
                <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg">
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    Add Ksh&nbsp;{(1500 - getCartTotal()).toFixed(2)} more for
                    free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Link to="/checkout" className="block mt-6">
                <Button
                  size="lg"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 cursor-pointer"
                >
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;