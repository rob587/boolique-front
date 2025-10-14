import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../src/store/useCartStore";
import useWishlistStore from "../src/store/useWishlIstStore";

const ProductCard = ({
  product,
  viewMode = "grid",
  editMode = false,
  onDelete,
}) => {
  const navigate = useNavigate();
  const goToDetail = () =>
    !editMode && navigate(`/details/${product.slug || product.id}`);

  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const isInWishlist = wishlist.some((p) => p.id === product.id);
  const isInCart = cart.some((p) => p.id === product.id);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
    if (isInWishlist) setShowConfirmationModal(true);
    else {
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

  const discountPercentage =
    product.sales !== 0
      ? Math.round(
          ((product.price - product.sales_price) / product.price) * 100
        )
      : 0;

  const RemovalConfirmationModal = () =>
    showConfirmationModal && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ zIndex: 1040, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={() => setShowConfirmationModal(false)}
      >
        <div
          className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg p-4"
          style={{ zIndex: 1050, width: "90%", maxWidth: "400px" }}
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

  // ✅ Layout a elenco (LIST VIEW)
  if (viewMode === "list") {
    return (
      <>
        <div
          className="card my-3 d-flex flex-row align-items-stretch p-2"
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            cursor: editMode ? "default" : "pointer",
          }}
          onClick={goToDetail}
        >
          {/* Bottone elimina */}
          {editMode && (
            <button
              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 z-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product.id);
              }}
            >
              X
            </button>
          )}

          {/* Immagine a sinistra */}
          <div className="flex-shrink-0" style={{ width: "200px" }}>
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid h-100"
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </div>

          {/* Contenuto a destra */}
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 className="card-title mb-2">{product.name}</h5>
              {product.description && (
                <p className="card-text text-muted small mb-2">
                  {product.description}
                </p>
              )}
              {product.sales !== 0 ? (
                <>
                  <p className="mb-1">
                    €{product.sales_price.toFixed(2)}
                    <span className="badge bg-danger ms-2">
                      -{discountPercentage}%
                    </span>
                  </p>
                  <p className="text-muted mb-0">
                    <small className="text-decoration-line-through">
                      €{product.price.toFixed(2)}
                    </small>
                  </p>
                </>
              ) : (
                <p className="fw-semibold">€{product.price.toFixed(2)}</p>
              )}
            </div>

            {/* ❤️ 🛒 sotto descrizione */}
            {!editMode && (
              <div className="mt-3 d-flex align-items-center gap-3">
                <i
                  className={`fa${isInWishlist ? "s" : "r"} fa-heart`}
                  style={{
                    color: isInWishlist ? "#C3993A" : "#111111",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                  }}
                  onClick={toggleWishlist}
                ></i>
                <i
                  className="fa-solid fa-cart-plus"
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: isInCart ? "#C3993A" : "#111111",
                  }}
                  onClick={toggleCart}
                ></i>
              </div>
            )}
          </div>
        </div>

        <RemovalConfirmationModal />
        <ConfirmationModal />
      </>
    );
  }

  // 🔸 VISTA GRIGLIA (rimane IDENTICA alla tua attuale)
  return (
    <>
      <div
        className="card h-100 my-3 position-relative"
        style={{ cursor: editMode ? "default" : "pointer" }}
        onClick={goToDetail}
      >
        {editMode && (
          <button
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 z-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
          >
            X
          </button>
        )}

        <div style={{ position: "relative" }}>
          <img
            src={product.image}
            className="card-img-top img-fluid"
            style={{ maxHeight: "33rem", objectFit: "cover" }}
            alt={product.name}
          />

          {!editMode && (
            <>
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
                className="fa-solid fa-cart-plus"
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
            </>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title flex-grow-1">{product.name}</h5>
          {product.sales !== 0 ? (
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
