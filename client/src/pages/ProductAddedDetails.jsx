import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductAddedDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/marketplace/added/${id}/`).then(r => r.json()).then(setProduct);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>Product Added Successfully!</h1>
      <h2>{product.name}</h2>
      <img src={product.main_image} alt={product.name} style={{ maxWidth: 300 }} />
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <Link to={`/products/${product.id}`}>View Product Details</Link>
      <Link to="/products"><button>Back to Products</button></Link>
    </div>
  );
}

export default ProductAddedDetails;
