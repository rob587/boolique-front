import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [query, setQuery] = useState("");

  // Leggi la query dalla URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialQ = searchParams.get("q")?.toLowerCase().trim() || "";
    setQuery(initialQ);
  }, [location.search]);

  // Carica i prodotti e estrai categorie + brand unici
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        const data = res.data;
        setProducts(data);

        const uniqueCats = Array.from(
          new Set(data.map((p) => p.category).filter(Boolean))
        );
        setCategories(uniqueCats);

        const uniqueBrands = Array.from(
          new Set(data.map((p) => p.brand).filter(Boolean))
        );
        setBrands(uniqueBrands);
      })
      .catch((err) => console.error("Errore nel caricamento dei prodotti:", err));
  }, []);

  // Filtra in base a query, categoria e brand
  useEffect(() => {
    let results = [...products];

    if (query) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand) {
      results = results.filter((p) => p.brand === selectedBrand);
    }

    setFiltered(results);
  }, [query, products, selectedCategory, selectedBrand]);

  // Toggle categoria: clic su stesso filtro lo deseleziona
  const handleCategoryClick = (cat) => {
    setSelectedCategory((prev) => (prev === cat ? "" : cat));
    setQuery("");
    window.history.replaceState({}, "", "/search");
  };

  // Toggle brand: clic su stesso filtro lo deseleziona
  const handleBrandClick = (brand) => {
    setSelectedBrand((prev) => (prev === brand ? "" : brand));
    setQuery("");
    window.history.replaceState({}, "", "/search");
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar sinistra */}
        <div className="col-md-3 col-lg-2 border-end">
          {/* Categorie */}
          <h5 className="mb-3">Categorie</h5>
          <ul className="list-group mb-4">
            <li
              className={`list-group-item ${selectedCategory === "" ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryClick("")}
            >
              Tutti
            </li>
            {categories.map((cat) => (
              <li
                key={cat}
                className={`list-group-item ${selectedCategory === cat ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>

          {/* Brand */}
          <h5 className="mb-3">Brand</h5>
          <ul className="list-group">
            <li
              className={`list-group-item ${selectedBrand === "" ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => handleBrandClick("")}
            >
              Tutti
            </li>
            {brands.map((brand) => (
              <li
                key={brand}
                className={`list-group-item ${selectedBrand === brand ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleBrandClick(brand)}
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>

        {/* Risultati destra */}
        <div className="col-md-9 col-lg-10">
          <h4 className="mb-4">
            {selectedCategory
              ? `Categoria: ${selectedCategory}`
              : selectedBrand
                ? `Brand: ${selectedBrand}`
                : query
                  ? `Risultati per: "${query}"`
                  : "Tutti i prodotti"}
          </h4>

          {filtered.length === 0 ? (
            <p>Nessun prodotto trovato.</p>
          ) : (
            <div className="row">
              {filtered.map((product) => (
                <div key={product.id} className="col-12 col-md-4 col-lg-3 mb-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .list-group-item.active {
          background-color: #C3993A;
          border-color: #C3993A;
          color: #111111;
          font-weight: 600;
        }
        .list-group-item {
          transition: all 0.2s ease;
        }
        .list-group-item:hover {
          background-color: #111111;
          color: #C3993A;
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
