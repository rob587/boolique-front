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

  // 🔹 Leggi query dalla URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setQuery(searchParams.get("q")?.toLowerCase().trim() || "");
  }, [location.search]);

  // 🔹 Funzione per caricare prodotti dal backend
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

  // 🔹 Carica prodotti inizialmente e ad ogni modifica dei filtri/query
  useEffect(() => {
    loadProducts();
  }, [query, selectedCategory, selectedBrand]);

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

  // 🔹 Toggle filtri
  const toggleCategory = (cat) => setSelectedCategory(prev => prev === cat ? "" : cat);
  const toggleBrand = (brand) => setSelectedBrand(prev => prev === brand ? "" : brand);

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 border-end">
          <h5 className="mb-3">Categorie</h5>
          <ul className="list-group mb-4">
            <li className={`list-group-item ${selectedCategory === "" ? "active" : ""}`} onClick={() => toggleCategory("")} style={{cursor: "pointer"}}>Tutti</li>
            {categories.map(cat => (
              <li key={cat} className={`list-group-item ${selectedCategory === cat ? "active" : ""}`} onClick={() => toggleCategory(cat)} style={{cursor: "pointer"}}>{cat}</li>
            ))}
          </ul>

          <h5 className="mb-3">Brand</h5>
          <ul className="list-group">
            <li className={`list-group-item ${selectedBrand === "" ? "active" : ""}`} onClick={() => toggleBrand("")} style={{cursor: "pointer"}}>Tutti</li>
            {brands.map(brand => (
              <li key={brand} className={`list-group-item ${selectedBrand === brand ? "active" : ""}`} onClick={() => toggleBrand(brand)} style={{cursor: "pointer"}}>{brand}</li>
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