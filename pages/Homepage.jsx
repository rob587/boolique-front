import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Featured from "../components/Featured";
import BestSellers from "../components/BestSellers";
import ProductCard from "../components/ProductCard";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellersProducts, setBestSellersProducts] = useState([]);

  const url = "http://localhost:3000/products";

  // funzione per shuffle casuale dell'array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchData = () => {
    axios.get(url).then((resp) => {
      setProducts(resp.data);
      // seleziona 9 prodotti casuali per Featured
      const shuffledAll = shuffleArray(resp.data);
      setFeaturedProducts(shuffledAll.slice(0, 9));
      // seleziona 9 prodotti casuali per BestSellers
      const shuffledForBest = shuffleArray(resp.data);
      setBestSellersProducts(shuffledForBest.slice(0, 9));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="jumbotron-container d-flex justify-content-center align-items-center">
        <img
          className="jumbotron-image img-fluid"
          src="/jumbotron/jumbo.png"
          alt="Abiti in evidenza"
        />
        <div className="jumbotron-text text-center">
          <h1>Nuova Collezione</h1>
          <p>Scopri i capi più amati della stagione</p>
        </div>
      </div>
      <div className="col-12 text-center my-5">
        <h1 className="title">BENVENUTO IN BOOLIQUE</h1>
        <h2 className="subtitle">La casa dell'eleganza sartoriale</h2>
      </div>

      {/* Featured */}
      <div className="container-h4 mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="subtitle">Prodotti di tendenza</h4>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <Featured products={featuredProducts} />
      </div>

      {/* BestSellers */}
      <div className="container-h4 mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="subtitle">I più venduti</h4>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <BestSellers products={bestSellersProducts} />
      </div>

      {/* link al carrello e wishlist */}
      <div className="container mb-5">
        <Link className="wish-link text-end fs-1" to={"wish"}>
          <i className="fa-solid fa-heart"></i>
        </Link>
        <Link className="cart-link text-end fs-1" to={"cart"}>
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
