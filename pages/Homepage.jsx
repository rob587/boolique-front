import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";


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

  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1>Prodotti in evidenza</h1>
          </div>
          <div className="col-12">
            <img
              src="../public/jumbotron/herospace.png"
              alt="abiti in evidenza"
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">

          {products.map((product) => {
            return (
              <div className="col-4" key={product.slug || product.id}>
                <div className="card my-3" style={{ height: "40rem" }} onClick={() => goToDetail(product)}>
                  <img
                    src={product.image}
                    className="card-img-top"
                    style={{ maxHeight: "33rem" }}
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
