import React from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../src/store/useCartStore";
import useWishlistStore from "../src/store/useWishlIstStore";

const ProductCard = ({ product, onShowNotification }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/details/${product.slug || product.id}`);

  // Wishlist store
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  // Cart store
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const isInWishlist = wishlist.some((p) => p.id === product.id);
  const isInCart = cart.some((p) => p.id === product.id);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      if (onShowNotification) {
        onShowNotification("Prodotto rimosso dalla wishlist", "error");
      }
    } else {
      addToWishlist(product);
      if (onShowNotification) {
        onShowNotification("Prodotto aggiunto alla wishlist!", "flash");
      }
    }
  };

  const toggleCart = (e) => {
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(product.id);
      if (onShowNotification) {
        onShowNotification("Prodotto rimosso dal carrello.", "error");
      }
    } else {
      addToCart(product);
      // Mostra la notifica di successo per il carrello usando il tipo 'flash'
      if (onShowNotification) {
        onShowNotification("Prodotto aggiunto al carrello!", "flash"); // Modificato qui
      }
    }
  };

  // Calcolo percentuale sconto se sales != 0
  const discountPercentage =
    product.sales != 0
      ? Math.round(
          ((product.price - product.sales_price) / product.price) * 100
        )
      : 0;

  return (
    <div className="card my-3" style={{ height: "40rem" }}>
      <div style={{ position: "relative" }}>
        <img
          src={product.image}
          className="card-img-top img-fluid"
          style={{ maxHeight: "33rem" }}
          alt={product.name}
          onClick={goToDetail}
        />

        {/* Cuore wishlist */}
        <i
          className={`fa${isInWishlist ? "s" : "r"} fa-heart`}
          style={{
            color: "#C3993A",
            cursor: "pointer",
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "1.5rem",
          }}
          onClick={toggleWishlist}
        ></i>

        {/* Carrello */}
        <i
          className={`fa-solid fa-cart-plus`}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            cursor: "pointer",
            fontSize: "1.5rem",
            color: isInCart ? "#C3993A" : "#111111",
          }}
          onClick={toggleCart}
        ></i>
      </div>

      <div className="card-body" onClick={goToDetail}>
        <h5 className="card-title">{product.name}</h5>
        {product.sales != 0 ? (
          <div>
            <p className="card-text mb-1">
              €{product.sales_price.toFixed(2)}
              <span className="badge bg-danger ms-2">
                -{discountPercentage}%
              </span>
            </p>
            <p className="card-text mb-0">
              <small className="text-decoration-line-through text-muted">
                €{product.price.toFixed(2)}
              </small>
            </p>
          </div>
        ) : (
       <p className="card-text">€{product.price.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;