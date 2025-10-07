import React from 'react'
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const goToDetail = (product) => {
    navigate(`/details/${product.slug || product.id}`);
  };
  return (
    <div
      className="card my-3"
      style={{ height: "40rem" }}
      onClick={() => goToDetail(product)}
    >
      <img
        src={product.image}
        className="card-img-top img-fluid"
        style={{ maxHeight: "33rem" }}
        alt={product.name}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">${product.price}</p>
      </div>
    </div>

  )
}

export default ProductCard
