const DetailProducts = () => {
  return(
     <div className="details-page">

      { /* HEADER */ }

      <header className="header">
        <div className="container d-flex justify-content-between align-item-center">
          <div className="logo">BOOLIQUE</div>
          <nav className="nav-menu d none d-md-flex gap-3">
            <a href="#" id="nav-link">Home</a>
            <a href="#" id="nav-link">Shop</a>
            <a href="#" id="nav-link">Contatti</a>
          </nav>
        </div>
      </header>

      {/* PRODUCT DETAILS */ }
      <section className="product-section">
        <div className="container">
          <div className="row g-4 align-item-start">
            <div className="col-md-6 text-center">
              <img className="img-fluid rounded mb-3 main-image" src="./public/img/vestito-prova.jpg" alt="Vestito-Prova" />
            </div>

            { /* INFO */ }

            <div className="com-md-6">
              <h1 className="product-title">GIACCA CAMMELLO</h1>
              <p className="price">€ 20.000,00</p>
              <p className="desc"> Giacca sartoriale in pelle di cammello extra-pesante, con taglio slim e fodera in seta. Cuciture rifinite a mano per un tocco di classe senza tempo.</p>

              <div className="mb-3">
                <label htmlFor="" className="form-label small text-uppercase text-secondary">
                  Taglia
                </label>
                  <div className="d-flex gap-2">
                   <button className="btn btn-outline-dark btn-size">46</button>
                   <button className="btn btn-outline-dark btn-size">48</button>
                   <button className="btn btn-outline-dark btn-size">50</button>
                   <button className="btn btn-outline-dark btn-size">52</button>
                  </div>
              </div>
              <div className="mb-4">
                <label htmlFor="" className="form-label small text-uppercase text-secondary">
                  Colore
                </label>
                <div className="d-flex gap-2 color-badges">
                  <span className="badge bg-dark">Nero</span>
                  <span className="badge bg-secondary">Grigio</span>
                  <span className="badge bg-warning">Cammello</span>                  
                </div>
              </div>

              <button className="btn-buy">Aggiungi al carrello</button>
            </div>
          </div>
        </div>
      </section>

      { /* FOOTER */ }
      <footer className="footer">
        <div className="container text-center">
          <p className="mb-0">© 2025 BOOLIQUE · Eleganza sartoriale</p>
        </div>
      </footer>
     </div>
  );
};

export default DetailProducts;

