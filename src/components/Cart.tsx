import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Navigate to checkout page (to be implemented)
    navigate("/checkout");
    setIsOpen(false);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const deliveryCharge = getCartTotal() > 500 ? 0 : 50;
  const finalTotal = getCartTotal() + deliveryCharge;

  return (
    <>
      {/* Cart Icon Button (for Navbar) */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCart}
          className="relative hover:bg-accent transition-colors"
        >
          <ShoppingCart className="h-5 w-5 hover:scale-125 hover:-translate-y-1 transition-all duration-300" />
          {getCartCount() > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {getCartCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={toggleCart}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-background z-50 shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-hover p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Your Cart
                  </h3>
                  <p className="text-white/80 text-xs">
                    {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add some medicines to get started!
                  </p>
                  <Button onClick={() => { navigate("/medicines"); setIsOpen(false); }}>
                    Browse Medicines
                  </Button>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <Card key={item.medicine.id} className="p-3">
                      <div className="flex gap-3">
                        {/* Image */}
                        <img
                          src={item.medicine.image}
                          alt={item.medicine.name}
                          className="w-20 h-20 object-cover rounded"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-1">
                            {item.medicine.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.medicine.genericName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.medicine.packSize}
                          </p>

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary">
                              ₹{item.medicine.price * item.quantity}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(
                                    item.medicine.id.toString(),
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(
                                    item.medicine.id.toString(),
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  removeFromCart(item.medicine.id.toString())
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Clear Cart Button */}
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleClearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3 bg-muted/20">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{getCartTotal()}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={`font-medium ${deliveryCharge === 0 ? "text-green-600" : ""}`}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>

                {deliveryCharge > 0 && getCartTotal() < 500 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{500 - getCartTotal()} more for FREE delivery!
                  </p>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-primary-hover hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
