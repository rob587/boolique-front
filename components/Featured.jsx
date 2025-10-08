import ProductCard from "./ProductCard";

const Featured = ({ products }) => {
  return (
    <div className="row">
      {products.map((product) => (
        <div
          className="col-12 col-md-6 col-lg-4 mb-4" // 3 per riga, con margine
          key={product.slug || product.id}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default Featured;