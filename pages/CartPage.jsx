import React from "react";
import DetailProducts from "./DetailProducts";
import Homepage from "./Homepage";
import { useState, useEffect } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Il carrello è vuoto! Aggiungi almeno un prodotto.");
      return;
    }
    setError("");
    alert("Pagamento effettuato!");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container my-5 pay-box">
      <div className="row">
        {/* Checkout */}
        <div className="col-md-8">
          <h2 className="mb-4">Check-out</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Inserisci il nome"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Inserisci il cognome"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Indirizzo di fatturazione"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Interno,scala, etc"
              />
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Inserisci il Cap"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Inserisci Città"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select className="form-select">
                  <option>Napoli</option>
                  <option>Salerno</option>
                  <option>Avellino</option>
                  <option>Caserta</option>
                  <option>Milano</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Metodo di pagamento</label>
              <select className="form-select">
                <option>Carta di credito</option>
                <option>PayPal</option>
                <option>Contrassegno</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 mt-3"
              disabled={cart.length === 0}
            >
              Procedi al pagamento
            </button>
          </form>
        </div>

        {/* Riepilogo carrello */}
        <div className="col-md-4">
          <h4 className="mb-3">Il tuo carrello</h4>

          {cart.length === 0 ? (
            <p>Il carrello è vuoto.</p>
          ) : (
            <ul className="list-group mb-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.name}</strong>
                    <br />
                    <small>Qt: {item.quantity}</small>
                  </div>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <strong>Totale</strong>
                <strong>€{total.toFixed(2)}</strong>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
