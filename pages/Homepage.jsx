import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Featured from "../components/Featured";
import BestSellers from "../components/BestSellers";
import DiscountedProducts from "../components/DiscountedProducts";
import ProductCard from "../components/ProductCard";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellersProducts, setBestSellersProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);

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
      // seleziona i 9 prodotti scontati per ID specifici
      const discountedIds = [
        "1",
        "8",
        "15",
        "21",
        "25",
        "30",
        "37",
        "44",
        "52",
      ];
      setDiscountedProducts(
        resp.data.filter((p) => discountedIds.includes(p.id.toString()))
      );
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

      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <img
              src="/homepagebanners/banner1.png"
              alt="banner1"
              className="img-fluid mb-4"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <img
              src="/homepagebanners/banner2.png"
              alt="banner2"
              className="img-fluid mb-4"
            />
          </div>
        </div>
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

      <div className="container">
        <div className="row">
          <div className="col-12">
            <img
              src="/homepagebanners/banner3 (1).png"
              alt="banner3"
              className="img-fluid mb-4"
            />
          </div>
        </div>
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

      <div className="container">
        <div className="row">
          <div className="col-12">
            <img
              src="/homepagebanners/banner41.png"
              alt="banner4"
              className="img-fluid mb-4"
            />
          </div>
        </div>
      </div>

      {/* DiscountedProducts */}
      <div className="container-h4 mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="subtitle">Prodotti in sconto</h4>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <DiscountedProducts products={discountedProducts} />
      </div>
    </div>
  );
};

export default Homepage;
