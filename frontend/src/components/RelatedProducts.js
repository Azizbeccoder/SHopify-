import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const RelatedProducts = ({ category, currentId }) => {
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!category) return;
    api.get('/products', { params: { category } }).then((res) => {
      setRelated(res.data.filter(p => p._id !== currentId).slice(0, 4));
    });
  }, [category, currentId]);

  if (related.length === 0) return null;

  return (
    <div className="related-products">
      <h3 className="related-title">You May Also Like</h3>
      <div className="related-grid">
        {related.map((p) => (
          <div key={p._id} className="related-card">
            <Link to={`/products/${p._id}`} className="related-img-wrap">
              <img src={p.image} alt={p.name} />
            </Link>
            <div className="related-info">
              <span className="related-category">{p.category}</span>
              <Link to={`/products/${p._id}`}>
                <h4>{p.name.length > 40 ? p.name.slice(0, 40) + '...' : p.name}</h4>
              </Link>
              <div className="related-footer">
                <strong>${Number(p.price).toFixed(2)}</strong>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(p)}
                  disabled={p.stock === 0}
                >
                  {p.stock === 0 ? 'Sold Out' : '+ Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;