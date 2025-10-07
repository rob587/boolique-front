import create from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(persist(
  (set, get) => ({
    cart: [],
    wishlist: [],

    addToCart: (product) => {
      const exists = get().cart.find(p => p.id === product.id);
      if (!exists) set({ cart: [...get().cart, product] });
    },
    removeFromCart: (productId) => {
      set({ cart: get().cart.filter(p => p.id !== productId) });
    },
    clearCart: () => set({ cart: [] }),

    addToWishlist: (product) => {
      const exists = get().wishlist.find(p => p.id === product.id);
      if (!exists) set({ wishlist: [...get().wishlist, product] });
    },
    removeFromWishlist: (productId) => {
      set({ wishlist: get().wishlist.filter(p => p.id !== productId) });
    },
  }),
  { name: "shop-storage" } // chiave su localStorage
));
