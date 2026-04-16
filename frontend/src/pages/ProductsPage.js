import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Shoes', 'Accessories', 'Bags', 'Home', 'Sports'];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.keyword = search;
    if (category && category !== 'All') params.category = category;
    api.get('/products', { params }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [search, category]);

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="products-title">All Products</h1>

        <div className="products-toolbar">
          <input
            type="text"
            placeholder="🔍  Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${category === cat || (cat === 'All' && !category) ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>😕 No products found. Try a different search.</p>
          </div>
        ) : (
          <>
            <p className="results-count">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
