import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // نحاول نجيب البيانات من localStorage أولًا
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    // نخزّن السلة في localStorage عند أي تغيير
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const existing = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
    );

    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        { ...product, quantity: product.quantity || 1 },
      ]);
    }
  };

  const removeFromCart = (product) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (
            item.id === product.id &&
            item.selectedSize === product.selectedSize &&
            item.selectedColor === product.selectedColor
          ) {
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return null;
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
