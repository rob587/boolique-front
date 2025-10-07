import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CartPage from "./CartPage";

const Homepage = () => {
  const [products, setProducts] = useState([]);

  const url = "http://localhost:3000/products";
  const navigate = useNavigate();
  const fetchData = () => {
    axios.get(url).then((resp) => {
      setProducts(resp.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const goToDetail = (product) => {
    navigate(`/details/${product.slug || product.id}`);
  };
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
      <div className="container mt-5">
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
                <div
                  className="card my-3"
                  style={{ height: "40rem" }}
                  onClick={() => goToDetail(product)}
                >
                  <img
                    src={product.image}
                    className="card-img-top img-fluid"
                    style={{ maxHeight: "33rem" }}
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">${product.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link className="wish-link text-end fs-1" to={"wish"}>
          <i class="fa-solid fa-heart"></i>
        </Link>
        <Link className="cart-link text-end fs-1" to={"cart"}>
          <i class="fa-solid fa-cart-shopping"></i>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
