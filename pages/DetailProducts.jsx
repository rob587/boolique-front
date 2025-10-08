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
               <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
                 <div className="carousel-inner">
                   {products.images.map((img, index) => (
                     <div
                       key={index}
                       className={`carousel-item ${index === 0 ? "active" : ""}`}
                     >
                       <img
                         src={img}
                         alt={`Slide ${index + 1}`}
                         className="d-block w-100 rounded main-image"
                       />
                     </div>
                   ))}
                 </div>

                 <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                   <span className="carousel-control-prev-icon"></span>
                 </button>

                 <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                   <span className="carousel-control-next-icon"></span>
                 </button>
               </div>
             )}
          </div>



            { /* INFO */}

            <div className="col-md-6">
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

