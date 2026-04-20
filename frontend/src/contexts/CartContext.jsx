import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Falha ao carregar o carrinho:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.idProduto === item.idProduto);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.idProduto === item.idProduto
            ? { ...cartItem, quantidade: cartItem.quantidade + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, quantidade: item.quantidade || 1 }];
    });
  };

  const updateQuantity = (id, quantidade) => {
    setCart((prev) => prev
      .map((item) => (item.idProduto === id ? { ...item, quantidade } : item))
      .filter((item) => item.quantidade > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.idProduto !== id));
  };

  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantidade, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.quantidade * item.preco, 0);
  const deliveryFee = cart.length > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;
  const estimatedPreparationTime = cart.length > 0
    ? Math.max(...cart.map((item) => item.preparationTime || 15))
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        estimatedPreparationTime
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
