import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCartStore from "../src/store/useCartStore";
import useWishlistStore from "../src/store/useWishlIstStore";

const DetailProducts = () => {
  const [products, setProducts] = useState(null);
  const [related, setRelated] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { param } = useParams();

  const addToCart = useCartStore((state) => state.addToCart);

  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);

  useEffect(() => {
    if (products && products.id) {
      axios
        .get(`http://localhost:3000/products/${products.id}/related`)
        .then((res) => setRelatedProducts(res.data))
        .catch((err) => console.error("Errore correlati:", err));
    }
  }, [products]);

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${param}`).then((res) => {
      setProducts(res.data);

      const categorySlug = res.data.category.slug;

      axios
        .get(`http://localhost:3000/products?category.slug=${categorySlug}`)
        .then((relatedRes) => {
          const filtered = relatedRes.data.filter(
            (item) => item.id !== res.data.id
          );
          setRelated(filtered);
        });
    });
  }, [param]);

  if (!products) {
    return (
      <div className="container my-5 text-center">Caricamento prodotto...</div>
    );
  }

  // Calcolo percentuale sconto se sales != 0
  const discountPercentage =
    products.sales != 0
      ? Math.round(
          ((products.price - products.sales_price) / products.price) * 100
        )
      : 0;

  return (
    <div className="detailspace">
    <div className="details-page">
      {/* PRODUCT DETAILS */}
      <section className="product-section">
        <div className="container my-4">
          <div className="row g-3 align-item-start">
            <div className="col-md-5 text-center">
              {products.images && products.images.length > 0 && (
                <div
                  id="productCarousel"
                  className="carousel slide shadow-lg rounded overflow-hidden bg-black p-2"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {products.images.map((img, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Slide ${index + 1}`}
                          className="d-block w-100 rounded main-image"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#productCarousel"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon"></span>
                  </button>

                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#productCarousel"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </div>
              )}
            </div>

            {/* INFO */}

            <div className="col-md-6">
              <h1 className="product-title">{products.name}</h1>
              {products.sales != 0 ? (
                <div>
                  <p className="price mb-1">
                    €{products.sales_price.toFixed(2)}
                    <span className="badge bg-danger ms-2">
                      -{discountPercentage}%
                    </span>
                  </p>
                  <p className="mb-0">
                    <small className="text-decoration-line-through text-muted">
                      €{products.price.toFixed(2)}
                    </small>
                  </p>
                </div>
              ) : (
                <p className="price">€{products.price.toFixed(2)}</p>
              )}
              <p className="desc">{products.description}</p>

              <div className="mb-3">
                <label
                  htmlFor=""
                  className="form-label small text-uppercase text-secondary"
                >
                  Taglia
                </label>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-dark btn-size">
                    {products.size}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor=""
                  className="form-label small text-uppercase text-secondary"
                >
                  Colore
                </label>
                <div className="d-flex gap-2 color-badges">
                  <span className="badge bg-dark">{products.color}</span>
                </div>
              </div>

              {/* Pulsanti */}
              <button
                className="btn-buy"
                data-bs-toggle="modal"
                data-bs-target="#cartModal"
                onClick={() => {
                  addToCart(products);
                }}
              >
                Aggiungi al carrello
              </button>

              <button
                className="btn-buy"
                data-bs-toggle="modal"
                data-bs-target="#wishlistModal"
                onClick={() => {
                  addToWishlist(products);
                }}
              >
                Aggiungi alla Wishlist
              </button>

              {/* MODALE CARRELLO */}
              <div
                className="modal fade"
                id="cartModal"
                tabIndex="-1"
                aria-labelledby="cartModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header"></div>
                    <div className="modal-body text-center">
                      Aggiunto al carrello correttamente!
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-dark w-100 mt-3"
                        data-bs-dismiss="modal"
                      >
                        Chiudi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODALE WISHLIST */}
              <div
                className="modal fade"
                id="wishlistModal"
                tabIndex="-1"
                aria-labelledby="wishlistModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header"></div>
                    <div className="modal-body text-center">
                      Aggiunto alla wishlist correttamente!
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-dark w-100 mt-3"
                        data-bs-dismiss="modal"
                      >
                        Chiudi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODOTTI CORRELATI */}
      <section className="related-section container my-5">
        <h2 className="mb-4">Prodotti correlati</h2>
        <div className="row g-4">
          {relatedProducts.map((prod) => {
            const relatedDiscountPercentage =
              prod.sales != 0 && prod.price && prod.sales_price
                ? Math.round(
                    ((prod.price - prod.sales_price) / prod.price) * 100
                  )
                : 0;

            return (
              <div key={prod.id} className="col-6 col-md-3">
                <div className="card h-100 text-center shadow-lg">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="card-img-top rounded"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{prod.name}</h5>
                    {prod.sales != 0 && prod.price && prod.sales_price ? (
                      <div className="mb-2">
                        <span className="fw-bold">
                          €{prod.sales_price.toFixed(2)}
                        </span>
                        <small className="text-decoration-line-through text-muted mx-1">
                          €{prod.price.toFixed(2)}
                        </small>
                        <span className="badge bg-danger">
                          -{relatedDiscountPercentage}%
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted mb-2">
                        €{prod.price?.toFixed(2) || "N/A"}
                      </p>
                    )}
                    <a
                      href={`/details/${prod.slug}`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      Vedi prodotto
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div> </div>
  );
};

export default DetailProducts;
