import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [editMode, setEditMode] = useState(false); // 👈 nuovo stato per attivare la modalità eliminazione

  // Carica prodotti
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      const data = res.data;
      setProducts(data);

      setCategories(
        Array.from(new Set(data.map((p) => p.category).filter(Boolean)))
      );
      setBrands(Array.from(new Set(data.map((p) => p.brand).filter(Boolean))));
    } catch (err) {
      console.error("Errore caricamento prodotti:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Legge i parametri dalla URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setQuery(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedBrand(searchParams.get("brand") || "");
  }, [location.search]);

  // Filtra prodotti
  useEffect(() => {
    let results = [...products];

    if (query) {
      const qLower = query.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          (p.brand && p.brand.toLowerCase().includes(qLower)) ||
          (p.category && p.category.toLowerCase().includes(qLower))
      );
    }

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand) {
      results = results.filter((p) => p.brand === selectedBrand);
    }

    setFiltered(results);
  }, [products, query, selectedCategory, selectedBrand]);

  // Gestione ricerca
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams(location.search);
    params.delete("q");
    params.delete("brand");
    cat ? params.set("category", cat) : params.delete("category");
    navigate(`/search?${params.toString()}`);
  };

  const handleBrandClick = (brand) => {
    const params = new URLSearchParams(location.search);
    params.delete("q");
    params.delete("category");
    brand ? params.set("brand", brand) : params.delete("brand");
    navigate(`/search?${params.toString()}`);
  };

  const handleViewToggle = (mode) => setViewMode(mode);

  // 🗑️ Eliminazione prodotto
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare questo prodotto?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Prodotto eliminato con successo!");
    } catch (err) {
      console.error("Errore durante l'eliminazione:", err);
      alert("❌ Errore durante l'eliminazione del prodotto");
    }
  };

  return ( 
    <div className="searchlist">
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 border-end">
          <h5 className="mb-3">Categorie</h5>
          <ul className="list-group mb-4">
            <li
              className={`list-group-item ${!selectedCategory ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryClick("")}
            >
              Tutti
            </li>
            {categories.map((cat) => (
              <li
                key={cat}
                className={`list-group-item ${selectedCategory === cat ? "active" : ""
                  }`}
                style={{ cursor: "pointer" }}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>

          <h5 className="mb-3">Brand</h5>
          <ul className="list-group">
            <li
              className={`list-group-item ${!selectedBrand ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => handleBrandClick("")}
            >
              Tutti
            </li>
            {brands.map((brand) => (
              <li
                key={brand}
                className={`list-group-item ${selectedBrand === brand ? "active" : ""
                  }`}
                style={{ cursor: "pointer" }}
                onClick={() => handleBrandClick(brand)}
              >
                {brand}
              </li>
            ))}
          </ul>

          <hr />
          {/* 🛠️ Toggle modalità modifica */}
          <button
            className={`btn ${editMode ? "btn-danger" : "btn-outline-danger"} w-100 mt-3`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Esci dalla Modifica" : "Modifica Prodotti"}
          </button>
        </div>

        {/* Risultati */}
        <div className="col-md-9 col-lg-10">
          <form className="mb-3 d-flex" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="form-control me-2"
              placeholder="Cerca per nome, brand o categoria"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-warning" type="submit">
              Cerca
            </button>
          </form>

          <div className="mb-3">
            <button
              className={`btn me-2 ${viewMode === "grid" ? "btn-warning" : "btn-outline-warning"
                }`}
              onClick={() => handleViewToggle("grid")}
            >
              Griglia
            </button>
            <button
              className={`btn ${viewMode === "list" ? "btn-warning" : "btn-outline-warning"
                }`}
              onClick={() => handleViewToggle("list")}
            >
              Elenco
            </button>
          </div>

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
                <div
                  key={product.id}
                  className={`col-12 mb-3 ${viewMode === "grid" ? "col-md-4 col-lg-3" : ""
                    }`}
                >
                  <ProductCard
                    product={product}
                    viewMode={viewMode}
                    editMode={editMode}
                    onDelete={handleDeleteProduct} // 👈 passiamo la funzione di eliminazione
                  />
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
    </div> </div>
  );
};

export default SearchPage;
