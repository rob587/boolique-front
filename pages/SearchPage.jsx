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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [query, setQuery] = useState("");

  // 🔹 Leggi query e filtri dalla URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q")?.toLowerCase().trim() || "");
    setSelectedCategory(params.get("category") || "");
    setSelectedBrand(params.get("brand") || "");
  }, [location.search]);

  // 🔹 Carica prodotti dal backend
  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      const data = res.data;

      setProducts(data);
      setCategories([...new Set(data.map(p => p.category).filter(Boolean))]);
      setBrands([...new Set(data.map(p => p.brand).filter(Boolean))]);
    } catch (err) {
      console.error("Errore caricamento prodotti:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 Filtra prodotti lato client
  useEffect(() => {
    let results = [...products];

    if (query) {
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) results = results.filter(p => p.category === selectedCategory);
    if (selectedBrand) results = results.filter(p => p.brand === selectedBrand);

    setFiltered(results);
  }, [products, query, selectedCategory, selectedBrand]);

  // 🔹 Aggiorna URL quando si cambia un filtro o la query
  const updateURL = (newQuery, category = selectedCategory, brand = selectedBrand) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);

    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const handleCategoryClick = (cat) => {
    const newCat = selectedCategory === cat ? "" : cat;
    setSelectedCategory(newCat);
    updateURL(query, newCat, selectedBrand);
  };

  const handleBrandClick = (brand) => {
    const newBrand = selectedBrand === brand ? "" : brand;
    setSelectedBrand(newBrand);
    updateURL(query, selectedCategory, newBrand);
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 border-end">
          <h5 className="mb-3">Categorie</h5>
          <ul className="list-group mb-4">
            <li className={`list-group-item ${selectedCategory === "" ? "active" : ""}`} onClick={() => handleCategoryClick("")} style={{cursor: "pointer"}}>Tutti</li>
            {categories.map(cat => (
              <li key={cat} className={`list-group-item ${selectedCategory === cat ? "active" : ""}`} onClick={() => handleCategoryClick(cat)} style={{cursor: "pointer"}}>{cat}</li>
            ))}
          </ul>

          <h5 className="mb-3">Brand</h5>
          <ul className="list-group">
            <li className={`list-group-item ${selectedBrand === "" ? "active" : ""}`} onClick={() => handleBrandClick("")} style={{cursor: "pointer"}}>Tutti</li>
            {brands.map(brand => (
              <li key={brand} className={`list-group-item ${selectedBrand === brand ? "active" : ""}`} onClick={() => handleBrandClick(brand)} style={{cursor: "pointer"}}>{brand}</li>
            ))}
          </ul>
        </div>

        {/* Prodotti */}
        <div className="col-md-9 col-lg-10">
          <h4 className="mb-4">
            {selectedCategory ? `Categoria: ${selectedCategory}` :
             selectedBrand ? `Brand: ${selectedBrand}` :
             query ? `Risultati per: "${query}"` : "Tutti i prodotti"}
          </h4>

          {filtered.length === 0 ? <p>Nessun prodotto trovato.</p> :
            <div className="row">
              {filtered.map(p => (
                <div key={p.id} className="col-12 col-md-4 col-lg-3 mb-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      <style>{`
        .list-group-item.active {
          background-color: #C3993A;
          border-color: #C3993A;
          color: #111111;
          font-weight: 600;
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
