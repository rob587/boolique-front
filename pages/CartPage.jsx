import { useState } from "react";
import useCartStore from "../src/store/useCartStore";
import axios from "axios";
import emailjs from "emailjs-com";

// numero ordine progressivo
function generateOrderNumber() {
  const lastOrder = localStorage.getItem("lastOrderNumber");
  const nextOrder = lastOrder ? parseInt(lastOrder) + 1 : 1;
  localStorage.setItem("lastOrderNumber", nextOrder);
  return nextOrder;
}

// numero cliente fisso per email
function getOrCreateCustomerNumber(email) {
  let customers = JSON.parse(localStorage.getItem("customers")) || {};
  if (customers[email]) return customers[email];

  const lastCustomer = localStorage.getItem("lastCustomerNumber");
  const nextCustomer = lastCustomer ? parseInt(lastCustomer) + 1 : 1;

  customers[email] = nextCustomer;
  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.setItem("lastCustomerNumber", nextCustomer);
  return nextCustomer;
}

const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [discountCode, setDiscountCode] = useState("");         
  const [discountPercent, setDiscountPercent] = useState(0);    
  const [discountError, setDiscountError] = useState("");       

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.sales_price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  const shippingCost = total > 500 ? 0 : 20;
  const discountAmount = (total * discountPercent) / 100;
  const finalTotal = total - discountAmount + shippingCost;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Inserisci un codice sconto valido.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/discount/validate", {
        code: discountCode.trim(),
      });

      if (res.data.valid) {
        setDiscountPercent(res.data.percent);
        setDiscountError("");
        setModalType("success");
        setModalMessage(`✅ Codice sconto applicato: -${res.data.percent}%`);
        setShowModal(true);
      } else {
        setDiscountPercent(0);
        setDiscountError("❌ Codice sconto non valido o scaduto.");
      }
    } catch (err) {
      console.error(err);
      setDiscountPercent(0);
      setDiscountError("❌ Errore nella verifica del codice.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const name = formData.get("nome");
    const surname = formData.get("cognome");
    const email = formData.get("email");
    const indirizzo = formData.get("indirizzo");
    const interno = formData.get("interno") || "";
    const cap = formData.get("cap");
    const citta = formData.get("citta");
    const provincia = formData.get("provincia");
    const pagamento = formData.get("pagamento");

    const address = `${indirizzo} ${interno ? ", " + interno : ""
      }, ${cap} ${citta} (${provincia})`;

    if (
      !name ||
      !surname ||
      !email ||
      !indirizzo ||
      !cap ||
      !citta ||
      !provincia ||
      !pagamento ||
      cart.length === 0
    ) {
      setModalType("error");
      setModalMessage("⚠️ Compila tutti i campi e aggiungi almeno un prodotto al carrello!");
      setShowModal(true);
      return;
    }

    const free_shipping = total > 500;
    const order_number = generateOrderNumber();
    const customer_number = getOrCreateCustomerNumber(email);

    const orderData = {
      order_number,
      customer_number,
      name,
      surname,
      email,
      address,
      pagamento,
      free_shipping,
      amount: finalTotal,  // 👈 totale scontato
      discount_code: discountCode.trim() || null, // 👈 aggiunto campo sconto
      cartItems: cart.map((item) => ({
        id: item.id,
        name: item.name,
        sales_price: item.sales_price,
        quantity: item.quantity || 1,
      })),
    };

    try {
      const res = await axios.post("http://localhost:3000/orders", orderData);

      if (res.status === 201) {
        // email admin
        await emailjs.send(
          "service_qzbsi0g",
          "template_vdx9vwa",
          {
            order_number,
            customer_number,
            nome: name,
            cognome: surname,
            email,
            indirizzo: address,
            pagamento,
            totale: finalTotal.toFixed(2),
            prodotti: cart
              .map((item) => {
                const qty = parseInt(item.quantity) || 1;
                const price = parseFloat(item.sales_price) || 0;
                return `${item.name} (x${qty}) - €${(price * qty).toFixed(2)}`;
              })
              .join("<br>"),
          },
          "K3JfamoSQh9AVE4XN"
        );

        // email cliente
        await emailjs.send(
          "service_qzbsi0g",
          "template_8gxvhar",
          {
            nome: name,
            cognome: surname,
            email,
            order_number,
            prodotti: cart
              .map((item) => {
                const qty = parseInt(item.quantity) || 1;
                const price = parseFloat(item.sales_price) || 0;
                return `• ${item.name} x${qty} (€${(price * qty).toFixed(2)})`;
              })
              .join("<br>")
          },
          "K3JfamoSQh9AVE4XN"
        );

        setModalType("success");
        setModalMessage("✅ Ordine creato con successo e email inviata!");
        setShowModal(true);
        clearCart();
      }
    } catch (err) {
      console.error(err);
      setModalType("error");
      setModalMessage("❌ Errore durante la creazione o invio dell'ordine.");
      setShowModal(true);
    }
  };

  return (
    <div className="container my-5 pay-box">
      <div className="row">
        {/* Checkout */}
        <div className="col-12 col-md-7 col-lg-8 mb-5">
          <h2 className="mb-4">Check-out</h2>
          <form onSubmit={handleSubmit}>
            {/* campi utente */}
            <div className="mb-3"><input type="text" name="nome" className="form-control" placeholder="Inserisci il nome" required /></div>
            <div className="mb-3"><input type="text" name="cognome" className="form-control" placeholder="Inserisci il cognome" required /></div>
            <div className="mb-3"><input type="email" name="email" className="form-control" placeholder="Inserisci la tua mail" required /></div>
            <div className="mb-3"><input type="text" name="indirizzo" className="form-control" placeholder="Indirizzo di fatturazione" required /></div>
            <div className="mb-3"><input type="text" name="interno" className="form-control" placeholder="Interno, scala, ecc." /></div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3"><input type="text" name="cap" className="form-control" placeholder="CAP" required /></div></div>
              <div className="col-md-4"><div className="mb-3"><input type="text" name="citta" className="form-control" placeholder="Città" required /></div></div>
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

            <button type="submit" className="btn btn-dark w-100 mt-3" disabled={cart.length === 0}>
              Procedi al pagamento
            </button>
          </form>
        </div>

        {/* Riepilogo carrello */}
        <div className="col-12 col-md-5 col-lg-4">
          <h4 className="mb-3">Il tuo carrello</h4>
          <span>Se la spedizione è superiore i 500€ è gratuita!</span>
          <span className="mb-2 d-block">Altrimenti ci sono 20€ di spedizione</span>

          {cart.length === 0 ? (
            <p className="mt-3">Il carrello è vuoto.</p>
          ) : (
            <ul className="list-group mb-3">
              {cart.map((item) => {
                const unitPrice = parseFloat(item.sales_price) || 0;
                const originalPrice = parseFloat(item.price) || unitPrice;
                const discountPercentage =
                  item.sales != 0 && originalPrice > 0
                    ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
                    : 0;
                const isDiscounted = item.sales != 0 && discountPercentage > 0;
                const quantity = parseInt(item.quantity) || 1;

                return (
                  <li key={item.id} className="list-group-item">
                    <div className="d-flex gap-3">
                      <img src={item.image || item.img || "https://via.placeholder.com/80"}
                        alt={item.name}
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{item.name}</strong>
                            <span className="badge text-bg-success ms-2">Disponibile</span>
                            <br />
                            {isDiscounted ? (
                              <>
                                <small className="mb-1 d-block">
                                  €{unitPrice.toFixed(2)} cad.
                                  <span className="badge bg-danger ms-1">
                                    -{discountPercentage}%
                                  </span>
                                </small>
                                <small className="text-decoration-line-through text-muted">
                                  €{originalPrice.toFixed(2)}
                                </small>
                              </>
                            ) : (
                              <small>€{originalPrice.toFixed(2)} cad.</small>
                            )}
                          </div>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              if (quantity === 1) {
                                setModalType("confirm");
                                setModalMessage(`Vuoi rimuovere "${item.name}" dal carrello?`);
                                setPendingRemoveId(item.id);
                                setShowModal(true);
                              } else {
                                updateQuantity(item.id, quantity - 1);
                              }
                            }}
                          >
                            ×
                          </button>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                if (quantity === 1) {
                                  setModalType("confirm");
                                  setModalMessage(`Vuoi rimuovere "${item.name}" dal carrello?`);
                                  setPendingRemoveId(item.id);
                                  setShowModal(true);
                                } else {
                                  updateQuantity(item.id, quantity - 1);
                                }
                              }}
                            >−</button>
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
                              onClick={() => updateQuantity(item.id, quantity + 1)}
                            >+</button>
                          </div>
                          <strong>€{(unitPrice * quantity).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}

              {/* CODICE SCONTO */}
              <li className="list-group-item codice-sconto-box">
                <label htmlFor="codiceSconto" className="form-label mb-1">
                  Hai un codice sconto?
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    id="codiceSconto"
                    className="form-control"
                    placeholder="Inserisci il codice"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button type="button" className="btn btn-outline-dark" onClick={handleApplyDiscount}>
                    Applica
                  </button>
                </div>
                {discountError && (
                  <small className="text-danger mt-1 d-block">{discountError}</small>
                )}
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Totale prodotti</span>
                <strong>€{total.toFixed(2)}</strong>
              </li>

              {discountPercent > 0 && (
                <li className="list-group-item d-flex justify-content-between text-success">
                  <span>Sconto {discountPercent}%</span>
                  <strong>- €{discountAmount.toFixed(2)}</strong>
                </li>
              )}

              <li className="list-group-item d-flex justify-content-between">
                <span>Spedizione</span>
                {shippingCost === 0 ? (
                  <strong className="text-success">Gratuita 🚚</strong>
                ) : (
                  <strong>€{shippingCost.toFixed(2)}</strong>
                )}
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <strong>Totale finale</strong>
                <strong>€{finalTotal.toFixed(2)}</strong>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className={`modal-body text-center ${modalType === "success"
                    ? "text-success"
                    : modalType === "error"
                      ? "text-danger"
                      : ""
                  }`}
              >
                <h5>{modalMessage}</h5>
              </div>

              <div className="modal-footer">
                {modalType === "confirm" ? (
                  <div className="d-flex w-100 gap-2">
                    <button
                      type="button"
                      className="btn btn-danger w-50"
                      onClick={() => {
                        if (pendingRemoveId) {
                          removeFromCart(pendingRemoveId);
                          setPendingRemoveId(null);
                        }
                        setShowModal(false);
                      }}
                    >
                      Sì, rimuovi
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary w-50"
                      onClick={() => {
                        setPendingRemoveId(null);
                        setShowModal(false);
                      }}
                    >
                      Annulla
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-dark w-100"
                    onClick={() => setShowModal(false)}
                  >
                    Chiudi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
