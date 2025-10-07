import React from 'react'


const WishList = () => {
  return (
   <div className="wishlist-container">
      <header className="wishlist-header py-4 text-center">
        <h1 className="fw-bold">La mia Wishlist</h1>
      </header>

      <main className="container my-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card wishlist-card h-100">
              <img
                src="https://via.placeholder.com/300x200"
                className="card-img-top"
                alt="Borsa in pelle artigianale"
              />
              <div className="card-body">
                <h5 className="card-title">Borsa in pelle artigianale</h5>
                <p className="card-text">
                  Borsa elegante realizzata a mano in Italia.
                </p>
                <p className="wishlist-price">€120,00</p>
                <button className="btn wishlist-btn">Aggiungi al carrello</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card wishlist-card h-100">
              <img
                src="https://via.placeholder.com/300x200"
                className="card-img-top"
                alt="Orologio minimal"
              />
              <div className="card-body">
                <h5 className="card-title">Orologio minimal</h5>
                <p className="card-text">
                  Design pulito con cinturino in acciaio.
                </p>
                <p className="wishlist-price">€85,00</p>
                <button className="btn wishlist-btn">Aggiungi al carrello</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card wishlist-card h-100">
              <img
                src="https://via.placeholder.com/300x200"
                className="card-img-top"
                alt="Candela profumata al sandalo"
              />
              <div className="card-body">
                <h5 className="card-title">Candela profumata al sandalo</h5>
                <p className="card-text">
                  Crea un'atmosfera calda e rilassante.
                </p>
                <p className="wishlist-price">€25,00</p>
                <button className="btn wishlist-btn">Aggiungi al carrello</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="wishlist-footer py-3 text-center">
        <small>© 2025 Wishlist - Tutti i diritti riservati</small>
      </footer>
    </div>
  );
  
}

export default WishList
