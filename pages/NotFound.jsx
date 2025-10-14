import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-page my-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="my-5">
              <h1 className="display-4">404</h1>
              <img src="./imgs/not-found-img.png" className="img-fluid" />
              <p className="lead">Pagina non trovata 😕</p>
              <Link to="/" className="btn btn-warning mt-3">
                Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
