import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const DetailProducts = () => {
  const [products, setProducts] = useState([])
  const { param } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:3000/products/${param}`).then((res) => {
      setProducts(res.data)
    })
  }, [param])

  return (
    <div className="details-page">

      { /* HEADER */}

      {/* <header className="header">
        <div className="container d-flex justify-content-between align-item-center">
          <div className="logo">BOOLIQUE</div>
          <nav className="nav-menu d none d-md-flex gap-3">
            <a href="#" id="nav-link">Home</a>
            <a href="#" id="nav-link">Shop</a>
            <a href="#" id="nav-link">Contatti</a>
          </nav>
        </div>
      </header> */}
      {/* PRODUCT DETAILS */}
      <section className="product-section">
        <div className="container my-4">
          <div className="row g-3 align-item-start">
            <div className="col-md-5 text-center">
              {products.images && products.images.length > 0 && (
                products.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Immagine ${index + 1}`}
                    className="img-fluid rounded mb-3 main-image"
                  />
                ))
              )}
            </div>



            { /* INFO */}

            <div className="com-md-6">
              <h1 className="product-title">{products.name}</h1>
              <p className="price">${products.price}</p>
              <p className="desc">{products.description}</p>

              <div className="mb-3">
                <label htmlFor="" className="form-label small text-uppercase text-secondary">
                  Taglia
                </label>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-dark btn-size">{products.size}</button>
                  {/* <button className="btn btn-outline-dark btn-size">m</button>
                  <button className="btn btn-outline-dark btn-size">l</button>
                  <button className="btn btn-outline-dark btn-size">xl</button> */}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="" className="form-label small text-uppercase text-secondary">
                  Colore
                </label>
                <div className="d-flex gap-2 color-badges">
                  <span className="badge bg-dark">{products.color}</span>

                </div>
              </div>

              <button className="btn-buy">Aggiungi al carrello</button>
            </div>
          </div>
        </div>
      </section>

      { /* FOOTER */}
      {/* <footer className="footer">
        <div className="container text-center">
          <p className="mb-0">© 2025 BOOLIQUE · Eleganza sartoriale</p>
        </div>
      </footer> */}
    </div>
  );
};

export default DetailProducts;

