import { useState, useEffect } from "react";
import useCartStore from "../src/store/useCartStore";

const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nome = formData.get("nome");
    const cognome = formData.get("cognome");
    const indirizzo = formData.get("indirizzo");
    const cap = formData.get("cap");
    const citta = formData.get("citta");
    const provincia = formData.get("provincia");
    const pagamento = formData.get("pagamento");
    if (
      !nome ||
      !cognome ||
      !indirizzo ||
      !cap ||
      !citta ||
      !provincia ||
      !pagamento
    )
      setError("");
    clearCart();
  };

  const total = cart.reduce((sum, item) => {
    const price = item.price;
    const quantity = parseInt(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

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
                name="nome"
                className="form-control"
                placeholder="Inserisci il nome"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="cognome"
                className="form-control"
                placeholder="Inserisci il cognome"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="indirizzo"
                className="form-control"
                placeholder="Indirizzo di fatturazione"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Interno,scala, etc"
                required
              />
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <input
                    type="text"
                    name="cap"
                    className="form-control"
                    placeholder="Inserisci il Cap"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <input
                    type="text"
                    name="citta"
                    className="form-control"
                    placeholder="Inserisci Città"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select className="form-select" name="provincia" required>
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
              <select className="form-select" name="pagamento" required>
                <option>Carta di credito</option>
                <option>PayPal</option>
                <option>Contrassegno</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 mt-3"
              disabled={cart.length === 0}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Procedi al pagamento
            </button>
          </form>
        </div>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header"></div>
              <div class="modal-body">Pagamento effettuato correttamente!</div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-dark w-100 mt-3"
                  data-bs-dismiss="modal"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Riepilogo carrello */}
        <div className="col-md-4">
          <h4 className="mb-3">Il tuo carrello</h4>

          {cart.length === 0 ? (
            <p>Il carrello è vuoto.</p>
          ) : (
            <ul className="list-group mb-3">
              {cart.map((item) => {
                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 1;

                return (
                  <li key={item.id} className="list-group-item">
                    <div className="d-flex gap-3">
                      <img
                        src={
                          item.image ||
                          item.img ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{item.name}</strong>
                            <span className="badge text-bg-success ms-2">
                              Disponibile
                            </span>
                            <br />
                            <small className="text-muted">
                              €{price.toFixed(2)} cad.
                            </small>
                          </div>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            ×
                          </button>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                updateQuantity(item.id, quantity - 1)
                              }
                            >
                              −
                            </button>
                            <input
                              type="number"
                              className="form-control form-control-sm text-center"
                              style={{ width: "60px" }}
                              value={quantity}
                              min="1"
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                updateQuantity(item.id, newQty);
                              }}
                            />
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                updateQuantity(item.id, quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                          <strong>€{(price * quantity).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
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
