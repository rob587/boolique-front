import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useCartStore from '../src/store/useCartStore'; 
import useWishlistStore from '../src/store/useWishlIstStore';


const counterStyles = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  backgroundColor: "#c3993a",
  color: "black",
  borderRadius: "50%",
  padding: "5px 12px",
  fontSize: "14px",
  fontWeight: "bold",
  lineHeight: "",
  textAlign: "center",
  minWidth: "18px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const Header = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

/*recupero conteggio*/
 const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);

 /*calcolo conteggio*/
  const cartCount = cart.length;
  const wishlistCount = wishlist.length;


  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setProducts(res.data))
      .catch((err) =>
        console.error("Errore nel caricamento dei prodotti:", err)
      );
  }, []);

  useEffect(() => {
    const q = query.toLowerCase().trim();

    if (!q) {
      setFilteredProducts([]);
      return;
    }

    const scored = products
      .map((p) => {
        let score = 0;

        if (p.id.toString() === q) score += 100;
        if (p.slug && p.slug.toLowerCase() === q) score += 90;
        if (p.name.toLowerCase().includes(q)) score += 70;
        if (p.brand && p.brand.toLowerCase().includes(q)) score += 50;
        if (p.category && p.category.toLowerCase().includes(q)) score += 30;

        return { ...p, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setFilteredProducts(scored);
  }, [query, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setQuery("");
    }
  };

  const handleResultClick = (product) => {
    navigate(`/details/${product.slug || product.id}`);
    setQuery("");
  };

  return (
    <header>
      <nav className="navbar navbar-dark" style={{ backgroundColor: "#111" }}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img
              className="boolique-logo"
              src="../imgs/logo-boolique.png"
              alt="boolique"
              width="64"
              height="64"
            />
            <span className="logo d-none d-md-inline-block mx-3">Boolique</span>
          </Link>

          <form
            className="d-flex position-relative ms-auto me-3"
            role="search"
            onSubmit={handleSubmit}
            style={{ maxWidth: "400px" }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Cerca per nome, brand o categoria"
              aria-label="Cerca"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-warning" type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            {filteredProducts.length > 0 && (
              <div
                className="position-absolute dropdown-menu show bg-white border shadow"
                style={{
                  top: "100%",
                  left: 0,
                  width: "100%",
                  zIndex: 1050,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/details/${product.slug || product.id}`}
                    className="dropdown-item p-2 text-decoration-none border-bottom"
                    onClick={() => handleResultClick(product)}
                  >
                    <div className="d-flex align-items-center">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="rounded me-2"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div>
                        <div className="fw-bold small">{product.name}</div>
                        <div className="text-muted small">
                          {product.brand} - {product.category}
                        </div>
                        <div className="text-success small">
                          ${product.price}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {filteredProducts.length === 5 && (
                  <div className="dropdown-item text-center text-muted small">
                    ... e altri risultati
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="wishcart d-flex align-items-center">
            {/* Counter Wish */}
            <Link className="wish-link fs-1 me-3 position-relative" to={"wish"}>
              <i className="fa-solid fa-heart"></i>
              {wishlistCount > 0 && (
                <span className="counter wishlist-counter" style={counterStyles}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Counter Cart */}
            <Link className="cart-link fs-1 position-relative" to={"cart"}>
              <i className="fa-solid fa-cart-shopping"></i>
              {cartCount > 0 && (
                <span className="counter cart-counter" style={counterStyles}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;