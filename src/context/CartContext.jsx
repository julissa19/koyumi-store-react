import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product, quantity = 1) {
    const cantidadNueva = Number(quantity);

    if (cantidadNueva <= 0) {
      return;
    }

    setCart((prevCart) => {
      const itemExistente = prevCart.find((item) => item.id === product.id);

      if (itemExistente) {
        return prevCart.map((item) => {
          if (item.id !== product.id) {
            return item;
          }

          const stockDisponible = Number(item.stock) || item.cantidad + cantidadNueva;
          const cantidadActualizada = Math.min(
            item.cantidad + cantidadNueva,
            stockDisponible
          );

          return {
            ...item,
            cantidad: cantidadActualizada
          };
        });
      }

      const stockDisponible = Number(product.stock) || cantidadNueva;

      return [
        ...prevCart,
        {
          ...product,
          cantidad: Math.min(cantidadNueva, stockDisponible)
        }
      ];
    });
  }

  function removeItem(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  function increaseQuantity(productId) {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const stockDisponible = Number(item.stock) || item.cantidad + 1;

        return {
          ...item,
          cantidad: Math.min(item.cantidad + 1, stockDisponible)
        };
      })
    );
  }

  function decreaseQuantity(productId) {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id !== productId) {
            return item;
          }

          return {
            ...item,
            cantidad: item.cantidad - 1
          };
        })
        .filter((item) => item.cantidad > 0)
    );
  }

  function getCartQuantity() {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  }

  function getCartTotal() {
    return cart.reduce(
      (total, item) => total + Number(item.precio) * item.cantidad,
      0
    );
  }

  function isInCart(productId) {
    return cart.some((item) => item.id === productId);
  }

  const value = {
    cart,
    addToCart,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    getCartQuantity,
    getCartTotal,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}