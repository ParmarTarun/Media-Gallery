import { reactChildren } from "@/types";
import { ObjectId } from "mongodb";
import { createContext, useEffect, useState } from "react";

interface cartContextProps {
  cartProductIds: ObjectId[];
  addProductToCart: (pId: ObjectId) => void;
  removeProductFromCart: (pId: ObjectId) => void;
  clearCart: () => void;
}

const initialValues: cartContextProps = {
  cartProductIds: [],
  addProductToCart: () => {},
  removeProductFromCart: () => {},
  clearCart: () => {},
};

export const CartContext = createContext<cartContextProps>(initialValues);

const CartContextProvider = ({ children }: reactChildren) => {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProductIds, setCartProductIds] = useState<ObjectId[]>([]);

  useEffect(() => {
    if (cartProductIds.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartProductIds));
    }
  }, [cartProductIds]);

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      const lsValue = JSON.parse(ls.getItem("cart") || "") || [];
      setCartProductIds(lsValue);
    }
  }, []);

  const addProductToCart = (pId: ObjectId) => {
    if (pId) setCartProductIds((prev) => [...prev, pId]);
  };
  const removeProductFromCart = (pId: ObjectId) => {
    setCartProductIds((prev) => {
      const index = prev.indexOf(pId);
      if (index !== -1) return prev.filter((_, i) => i !== index);
      return prev;
    });
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartProductIds([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartProductIds,
        addProductToCart,
        removeProductFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
