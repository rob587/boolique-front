import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1>Prodotti in evidenza</h1>
          </div>
          <div className="col-6">
            <img
              src="../public/jumbotron/herospace.png"
              alt="abiti in evidenza"
            />
          </div>

          {products.map((product) => {
            return (
              <div className="col-6" key={product.id}>
                <div className="card" style={{ width: "18 rem" }}>
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.price}</p>
                  </div>
                </div>
              </div>

            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
