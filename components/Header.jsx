import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  // const [filteredProducts, setFilteredProducts] = useState([]);
  // const [search, setSearch] = useState("");

  // useEffect(() => {
  //   // inizializza i partecipanti
  //   if (trip) {
  //     setFilteredProducts(products);
  //   }
  // }, [name, brand]);

  // useEffect(() => {
  //   const tempProducts = products.filter((p) => `${p.name}`.includes(search));
  //   setFilteredProducts(tempProducts);
  // }, [search]);

  const ProductSearch = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Carica prodotti dal backend all'inizio
    useEffect(() => {
      axios
        .get("/api/products")
        .then((res) => setProducts(res.data))
        .catch((err) => console.error(err));
    }, []);

    // Filtra prodotti in base alla query
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
          if (p.slug.toLowerCase() === q) score += 90;
          if (p.name.toLowerCase().includes(q)) score += 70;
          if (p.brand.toLowerCase().includes(q)) score += 50;
          if (p.category.toLowerCase().includes(q)) score += 30;

          return { ...p, score };
        })
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score);

      setFilteredProducts(scored);
    }, [query, products]);
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
            <span className="d-none d-md-inline-block mx-4">Boolique</span>
          </Link>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Cerca"
              aria-label="Cerca"
            />
            <button className="btn btn-outline-warning" type="submit">
              Cerca
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
