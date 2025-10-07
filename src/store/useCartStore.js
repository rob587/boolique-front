import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const existing = get().cart.find(p => p.id === product.id);
        if (!existing) set({ cart: [...get().cart, product] });
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter(p => p.id !== id) });
      },
      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'cart-storage', // chiave su localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
