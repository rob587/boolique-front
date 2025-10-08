import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CartPage from "./CartPage";
import ProductCard from "../components/ProductCard";
const Homepage = () => {
  const [products, setProducts] = useState([]);

  const url = "http://localhost:3000/products";

  const fetchData = () => {
    axios.get(url).then((resp) => {
      setProducts(resp.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/products?minId=44&maxId=49")
      .then((resp) => setProducts(resp.data));
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
      <div className="container-h4 mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="subtitle">Prodotti in evidenza</h4>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="row">
          {products.map((product) => {
            return (
              <div
                className="col-12 col-sm-6 col-md-4"
                key={product.slug || product.id}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
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
