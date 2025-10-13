import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../src/store/useCartStore";
import useWishlistStore from "../src/store/useWishlIstStore";

const ProductCard = ({ product,}) => {
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

  // Stato per modale
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Timer per chiusura automatica
  const showConfirmation = (message) => {
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 1500); // chiude dopo 1.5 secondi
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      showConfirmation("Rimosso dalla wishlist");
    } else {
      addToWishlist(product);
      showConfirmation("Aggiunto alla wishlist ❤️");
    }
  };

  const toggleCart = (e) => {
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(product.id);
      showConfirmation("Rimosso dal carrello");
    } else {
      addToCart(product);
      showConfirmation("Aggiunto al carrello 🛒");
    }
  };

  // Calcolo percentuale sconto
  const discountPercentage =
    product.sales != 0
      ? Math.round(
          ((product.price - product.sales_price) / product.price) * 100
        )
      : 0;

  return (
    <div
      className="card my-3"
      style={{ height: "40rem", position: "relative" }}
    >
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

      {/* 🔹 Modal conferma semplice */}
      {showModal && (
        <div
          className="position-absolute top-50 start-50 translate-middle bg-dark text-white text-center p-3 rounded shadow"
          style={{
            zIndex: 9999,
            width: "80%",
            maxWidth: "300px",
            fontSize: "0.9rem",
          }}
        >
          {modalMessage}
        </div>
      )}
    </div>
  );
};

export default ProductCard;