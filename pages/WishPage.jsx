import React from "react";
import useWishlistStore from '../src/store/useWishlIstStore'; 
import ProductCard from '../components/ProductCard';

const WishPage = () => {
  const wishlistProducts = useWishlistStore((state) => state.wishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="title">La Tua Lista dei Desideri</h1>
          <p className="subtitle">I tuoi prodotti preferiti ti aspettano!</p>
        </div>
      </div>
      <div className="row">
        {wishlistProducts.length > 0 ? (
          wishlistProducts.map((product) => (
            <div
              className="col-12 col-sm-6 col-md-4 mb-4"
              key={product.slug || product.id}
            >
              <ProductCard product={product} />
      
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>La tua Wishlist è vuota</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishPage;