import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      addToWishlist: (product) => {
        const existing = get().wishlist.find(p => p.id === product.id);
        if (!existing) set({ wishlist: [...get().wishlist, product] });
      },
      removeFromWishlist: (id) => {
        set({ wishlist: get().wishlist.filter(p => p.id !== id) });
      },
      clearWishlist: () => set({ wishlist: [] })
    }),
    {
      name: 'wishlist-storage', // chiave su localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useWishlistStore;
