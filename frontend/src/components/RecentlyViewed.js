import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RecentlyViewed = ({ currentId }) => {
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setViewed(stored.filter(p => p._id !== currentId).slice(0, 4));
  }, [currentId]);

  if (viewed.length === 0) return null;

  return (
    <div className="recently-viewed">
      <h3 className="rv-title">Recently Viewed</h3>
      <div className="rv-grid">
        {viewed.map((p) => (
          <Link key={p._id} to={`/products/${p._id}`} className="rv-card">
            <img src={p.image} alt={p.name} />
            <div className="rv-info">
              <p>{p.name.length > 30 ? p.name.slice(0, 30) + '...' : p.name}</p>
              <strong>${Number(p.price).toFixed(2)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const addToRecentlyViewed = (product) => {
  const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  const filtered = stored.filter(p => p._id !== product._id);
  const updated = [{ _id: product._id, name: product.name, image: product.image, price: product.price }, ...filtered].slice(0, 8);
  localStorage.setItem('recentlyViewed', JSON.stringify(updated));
};

export default RecentlyViewed;