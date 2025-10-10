import { useState } from "react";
import useCartStore from "../src/store/useCartStore";

const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Stato per gestire il modal via React
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // success | error

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

    // Controlla se tutti i campi sono compilati
    if (
      !nome ||
      !cognome ||
      !indirizzo ||
      !cap ||
      !citta ||
      !provincia ||
      !pagamento
    ) {
      setModalType("error");
      setModalMessage("⚠️ Compila tutti i campi per procedere al pagamento!");
      setShowModal(true);
      return;
    }

    // Tutto ok → svuota carrello e mostra conferma
    clearCart();
    setModalType("success");
    setModalMessage("✅ Pagamento effettuato correttamente!");
    setShowModal(true);
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
        <div className="col-12 col-md-7 col-lg-8 mb-5">
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
                placeholder="Interno, scala, ecc."
              />
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <input
                    type="text"
                    name="cap"
                    className="form-control"
                    placeholder="CAP"
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
                    placeholder="Città"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select className="form-select" name="provincia" required>
                  <option value="">Provincia</option>
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
                <option value="">Seleziona...</option>
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
        <div className="col-12 col-md-5 col-lg-4">
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
                            <small>€{price.toFixed(2)} cad.</small>
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

      {/* Modal gestito da React */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className={`modal-body text-center ${modalType === "success" ? "text-success" : "text-danger"
                  }`}
              >
                <h5>{modalMessage}</h5>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark w-100"
                  onClick={() => setShowModal(false)}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
