import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../src/store/useCartStore";
import useWishlistStore from "../src/store/useWishlIstStore";

const ProductCard = ({ product, viewMode = "grid" }) => {
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

  // Stato per modale di conferma
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Timer per chiusura automatica
  const showConfirmation = (message) => {
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 1500);
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
    setShowConfirmationModal(false);
    showConfirmation("Rimosso dalla wishlist");
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      // Se è nella wishlist, mostra modal di conferma
      setShowConfirmationModal(true);
    } else {
      // Se non è nella wishlist, aggiungilo direttamente
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

  // Modal di conferma rimozione dalla wishlist
  const RemovalConfirmationModal = () =>
    showConfirmationModal && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          zIndex: 1040,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={() => setShowConfirmationModal(false)}
      >
        <div
          className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg p-4"
          style={{
            zIndex: 1050,
            width: "90%",
            maxWidth: "400px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h5 className="mb-3">Rimuovere dalla wishlist?</h5>
          <p className="text-muted mb-4">
            Sei sicuro di voler rimuovere "{product.name}" dai tuoi desideri?
          </p>
          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirmationModal(false)}
            >
              Annulla
            </button>
            <button
              className="btn btn-danger"
              onClick={handleRemoveFromWishlist}
            >
              Rimuovi
            </button>
          </div>
        </div>
      </div>
    );

  // Modal di conferma azione (feedback)
  const ConfirmationModal = () =>
    showModal && (
      <div
        className="position-fixed top-50 start-50 translate-middle bg-dark text-white text-center p-3 rounded shadow"
        style={{
          zIndex: 1050,
          width: "80%",
          maxWidth: "300px",
          fontSize: "0.9rem",
        }}
      >
        {modalMessage}
      </div>
    );

  if (viewMode === "list") {
    return (
      <>
        <div
          className="card mb-3 border-0 shadow-sm"
          style={{ cursor: "pointer" }}
          onClick={goToDetail}
        >
          <div className="card-body d-flex align-items-start p-3">
            <div className="me-3" style={{ flexShrink: 0 }}>
              <img
                src={product.image}
                className="rounded"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                alt={product.name}
              />
            </div>

            <div className="flex-grow-1">
              <h6 className="card-title mb-2">{product.name}</h6>
              {product.sales != 0 ? (
                <div>
                  <p className="card-text mb-1">
                    €{product.sales_price.toFixed(2)}
                    <span className="badge bg-danger ms-2">
                      -{discountPercentage}%
                    </span>
                  </p>
                  <p className="card-text mb-3">
                    <small className="text-decoration-line-through text-muted">
                      €{product.price.toFixed(2)}
                    </small>
                  </p>
                </div>
              ) : (
                <p className="card-text mb-3">€{product.price.toFixed(2)}</p>
              )}

              <div className="d-flex gap-3">
                <i
                  className={`fa${isInWishlist ? "s" : "r"} fa-heart`}
                  style={{
                    color: "#C3993A",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                  onClick={toggleWishlist}
                  title="Aggiungi/rimuovi dai preferiti"
                ></i>
                <i
                  className="fa-solid fa-cart-plus"
                  style={{
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    color: isInCart ? "#C3993A" : "#111111",
                  }}
                  onClick={toggleCart}
                  title="Aggiungi/rimuovi dal carrello"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <RemovalConfirmationModal />
        <ConfirmationModal />
      </>
    );
  }

  return (
    <>
      <div
        className="card h-100 my-3"
        style={{ cursor: "pointer" }}
        onClick={goToDetail}
      >
        <div style={{ position: "relative" }}>
          <img
            src={product.image}
            className="card-img-top img-fluid"
            style={{ maxHeight: "33rem", objectFit: "cover" }}
            alt={product.name}
          />

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

        <div className="card-body d-flex flex-column">
          <h5 className="card-title flex-grow-1">{product.name}</h5>
          {product.sales != 0 ? (
            <div className="mt-auto">
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
            <p className="card-text mt-auto">€{product.price.toFixed(2)}</p>
          )}
        </div>
      </div>
      <RemovalConfirmationModal />
      <ConfirmationModal />
    </>
  );
};

export default ProductCard;
