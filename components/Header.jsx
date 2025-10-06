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

  return (
    <header>
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <Link to="/" className="navbar-brand">
            <img
              className="boolique-logo"
              src="imgs/logo-boolique.png"
              alt="boolique"
              width="64"
              height="64"
            />
            <span>Boolique</span>
          </Link>
          <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Cerca"
              aria-label="Cerca"
            />
            <button class="btn btn-outline-success" type="submit">
              Cerca
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
