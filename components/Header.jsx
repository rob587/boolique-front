import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  // Carica tutti i prodotti dal backend all'avvio
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setProducts(res.data))
      .catch((err) =>
        console.error("Errore nel caricamento dei prodotti:", err)
      );
  }, []);

  // Filtra i prodotti in base alla query su name, brand e category
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
      .slice(0, 5); // Limita ai primi 5 risultati per il dropdown

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
    setQuery(""); // Pulisci la query dopo il click
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

          {/* Spostato qui la form e aggiunta la classe ms-auto */}
          <form
            className="d-flex position-relative ms-auto me-3" // Aggiunto ms-auto e me-3
            role="search"
            onSubmit={handleSubmit}
            style={{ maxWidth: "400px" }} // Opzionale: limita la larghezza
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

          {/* Wishlist e Carrello */}
          <div className="wishcart d-flex align-items-center"> {/* Aggiunto d-flex e align-items-center qui */}
            <Link className="wish-link fs-1 me-3" to={"wish"}> {/* Aggiunto me-3 */}
              <i className="fa-solid fa-heart"></i>
            </Link>
            <Link className="cart-link fs-1" to={"cart"}>
              <i className="fa-solid fa-cart-shopping"></i>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;