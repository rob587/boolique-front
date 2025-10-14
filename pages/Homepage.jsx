import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Featured from "../components/Featured";
import BestSellers from "../components/BestSellers";
import DiscountedProducts from "../components/DiscountedProducts";
import ProductCard from "../components/ProductCard";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellersProducts, setBestSellersProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  const url = "http://localhost:3000/products";

    // funzione per shuffle casuale dell'array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchData = () => {
    axios.get(url).then((resp) => {
      setProducts(resp.data);
       // seleziona 9 prodotti casuali per Featured
      const shuffledAll = shuffleArray(resp.data);
      setFeaturedProducts(shuffledAll.slice(0, 9));
       // seleziona 9 prodotti casuali per BestSellers
      const shuffledForBest = shuffleArray(resp.data);
      setBestSellersProducts(shuffledForBest.slice(0, 9));
       // seleziona i 9 prodotti scontati per ID specifici
      const discountedIds = [
        "1",
        "8",
        "15",
        "21",
        "25",
        "30",
        "37",
        "44",
        "52",
      ];
      setDiscountedProducts(
        resp.data.filter((p) => discountedIds.includes(p.id.toString()))
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotificationModal = (message, type = "flash") => {
    setShowModal(true);
    setModalMessage(message);
    setModalType(type);

    if (type !== "confirm") {
      const duration = type === "flash" ? 500 : 1000;
      setTimeout(() => {
        setShowModal(false);
        setModalMessage("");
        setModalType("success");
      }, duration);
    }
  };

  return (
    <div>
      
      <div className="jumbotron-container d-flex justify-content-center align-items-center">
        <img
          className="jumbotron-image img-fluid"
          src="/jumbotron/jumbo.png"
          alt="Abiti in evidenza"
        />
        <div className="jumbotron-text text-center">
          <h1>Nuova Collezione</h1>
          <p>Scopri i capi più amati della stagione</p>
        </div>
      </div>


      <div className="col-12 text-center">
        <h1 className="title">BENVENUTO IN BOOLIQUE</h1>
        <h2 className="subtitle">La casa dell'eleganza sartoriale</h2>
      </div> 

      {/*carosello*/}
      <div className="container my-4">
        <div
          id="homepageCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div className="carousel-inner">
            {/* Prima slide del carosello*/}
            <div className="carousel-item active">
              <div className="row g-1">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <img
                    src="/homepagebanners/aiuomo.png"
                    className="d-block w-100"
                    alt="Banner di Moda 1a"
                  />
                </div>
                <div className="col-lg-6  col-md-6 col-sm-12">
                  <img
                    src="/homepagebanners/aidonna.png"
                    className="d-block w-100"
                    alt="Banner di Moda 1b"
                  />
                </div>
              </div>
            </div>
            {/* Seconda slide del carosello: altre due immagini affiancate */}
            <div className="carousel-item">
              <div className="row g-1">
                <div className="col-lg-6  col-md-6 col-sm-12">
                  <img
                    src="/homepagebanners/scontiye.png"
                    className="d-block w-100"
                    alt="Banner di Moda 2a"
                  />
                </div>
                <div className="col-lg-6  col-md-6 col-sm-12">
                  <img
                    src="/homepagebanners/sconti.png" // ho riutilizzato banner41
                    className="d-block w-100"
                    alt="Banner di Moda 2b"
                  />
                </div>
              </div>
            </div>
            {/* Terza slide del carosello (il commento problematico è stato spostato) */}
             <div className="carousel-item">
              <div className="row g-1">
                <div className="col-lg-6  col-md-6 col-sm-12">
                  {/* Sostituisci con i tuoi percorsi */}
                  <img
                    src="/homepagebanners/nuoviaccessori.png"
                    className="d-block w-100"
                    alt="Nuovo Banner di Moda 3a"
                  />
                </div>
                <div className="col-lg-6  col-md-6 col-sm-12">
                  {/* Sostituisci con i tuoi percorsi */}
                  <img
                    src="/homepagebanners/newstore.png"
                    className="d-block w-100"
                    alt="Nuovo Banner di Moda 3b"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Controlli del carosello (frecce) */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homepageCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homepageCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
          {/* Indicatori del carosello (puntini in basso) */}
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#homepageCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#homepageCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#homepageCarousel"
              data-bs-slide-to="2" // Aggiunto per la terza slide
              aria-label="Slide 3"
            ></button>
          </div>
        </div>
      </div>

      <div className="simple-discount-banner-container">
  <div className="simple-discount-banner">
    <h3 className="simple-discount-text">SCOPRI I NOSTRI CODICI SCONTO</h3>
    <p className="simple-discount-tagline">SPEDIZIONE GRATUITA A PARTIRE DA 500€</p>
    <Link to="/search" className="simple-discount-button">
      VAI ALLO STORE
    </Link>
  </div>
</div>



      {/* Featured */}
      <div className="container-h4 mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="subtitle">Prodotti di tendenza</h4>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <Featured
          products={featuredProducts}
          onShowNotification={showNotificationModal}
        />
      </div>

<div className="largebanner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <img
              src="/homepagebanners/bestseller1.png"
              alt="banner3"
              className="img-fluid mb-4"
            />
          </div>
        </div>
      </div></div>

      {/* BestSellers */}
      <div className="container-h4 mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="subtitle">I più venduti</h4>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <BestSellers
          products={bestSellersProducts}
          onShowNotification={showNotificationModal}
        />
      </div>

     <div className="largebanner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <img
              src="/homepagebanners/inpromo.png"
              alt="banner4"
              className="img-fluid mb-4"
            />
          </div>
        </div>
      </div> </div>

      {/* DiscountedProducts */}
      <div className="container-h4 mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="subtitle">Prodotti in sconto</h4>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <DiscountedProducts
          products={discountedProducts}
          onShowNotification={showNotificationModal}
        />
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
                className={`modal-body text-center ${
                  modalType === "success" || modalType === "flash"
                    ? "text-success"
                    : modalType === "error"
                    ? "text-danger"
                    : ""
                }`}
              >
                <h5>{modalMessage}</h5>
              </div>

              {modalType === "confirm" && (
                <div className="modal-footer">
                  <div className="d-flex w-100 gap-2">
                    <button
                      type="button"
                      className="btn btn-danger w-50"
                      onClick={() => {
                        setPendingRemoveId(null);
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Homepage;