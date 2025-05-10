
import React from "react";
import "./Cart.css";
import { useCart } from "../../Context/CartContext.jsx";




const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  const hasItems = cartItems.length > 0;
  const deliveryFee = hasItems ? 3 : 0;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    if (!hasItems) {
      alert("Your cart is empty.");
      return;
    }

    const message = cartItems
      .map(
        (item, index) =>
          `\n\n🛒 *Item ${index + 1}*\n` +
          `Product: ${item.title}\n` +
          `Price: $${item.price}\n` +
          `Color: ${item.selectedColor}\n` +
          `Size: ${item.selectedSize}\n` +
          `Quantity: ${item.quantity}\n` +
          `Total: $${item.price * item.quantity}`
      )
      .join("");

    const finalMessage =
      `🛍️ *Order Summary*\n${message}\n\n` +
      `Subtotal: $${subtotal}\n` +
      `Delivery Fee: $${deliveryFee}\n` +
      `Total: $${total}`;

    const phone = "249997992091";
    const encodedMessage = encodeURIComponent(finalMessage);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="cart">
      {!hasItems && (
        <div className="empty-cart-message">
          <p>Your cart is currently empty. Please add some products to your cart.</p>
        </div>
      )}

      {hasItems && (
        <div className="list-table">
          <div className="list-table-format title">
            <p>Product</p>
            <p>Name</p>
            <p>Size</p>
            <p>Color</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>

          {cartItems.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={item.image} alt="Product" className="cart-image" />
              <p>{item.title}</p>
              <p>{item.selectedSize}</p>
              <p>{item.selectedColor}</p>
              <p>${item.price}</p>
              <p>{item.quantity}</p>
              <p>${item.price * item.quantity}</p>
              <p className="click" onClick={() => removeFromCart(item)}>
                X
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details total">
              <p>Total</p>
              <p>${total}</p>
            </div>
          </div>
        </div>
        <button className="checkout-btn" onClick={handleProceedToCheckout}>
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};


export default Cart;