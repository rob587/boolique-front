import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
    
        <div className="footer-left">
          <img src="../imgs/logo.png" alt="Logo" className="footer-logo" />
          <div className="elegant">Boolique, l'eleganza a portata di click</div>
        </div>

        <ul className="footer-links">
          <li><a href="#">Domande frequenti</a></li>
          <li><a href="#">Metodi di pagamento</a></li>
          <li><a href="#">Spedizioni</a></li>
          <li><a href="#">Buoni regalo</a></li>
        </ul>
        </div>
     
      </footer>
  );
};

export default Footer;