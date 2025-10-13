import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const existing = get().cart.find((p) => p.id === product.id);

        if (existing) {
          // Se il prodotto esiste già, incremento la quantità
          set({
            cart: get().cart.map((p) =>
              p.id === product.id
                ? { ...p, quantity: (p.quantity || 1) + 1 }
                : p
            ),
          });
        } else {
          // Se è nuovo, lo aggiungo con quantity = 1
          set({
            cart: [...get().cart, { ...product, quantity: 1 }],
          });
        }
      },

      updateQuantity: (id, newQuantity) => {
        if (newQuantity < 1) {
          set({ cart: get().cart.filter((p) => p.id !== id) });
        } else {
          set({
            cart: get().cart.map((p) =>
              p.id === id ? { ...p, quantity: newQuantity } : p
            ),
          });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((p) => p.id !== id) });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage", // chiave su localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
