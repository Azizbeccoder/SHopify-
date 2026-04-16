import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

const Stars = ({ rating, interactive, onRate }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={s <= Math.round(rating) ? 'star' : 'star star-empty'}
        style={interactive ? { cursor: 'pointer', fontSize: '1.3rem' } : {}}
        onClick={() => interactive && onRate(s)}
      >★</span>
    ))}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = () => {
    setLoading(true);
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewMsg('Review added!');
      setComment('');
      fetchProduct();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Error adding review');
    }
    setReviewLoading(false);
  };

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;
  if (!product) return <div className="page container"><p>Product not found.</p></div>;

  return (
    <div className="page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-img-wrap">
            <img src={product.image} alt={product.name} />
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="product-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-meta">
              <Stars rating={product.rating} />
              <span className="product-reviews">{product.numReviews} reviews</span>
            </div>

            <p className="detail-price">${product.price.toFixed(2)}</p>
            <p className="detail-desc">{product.description}</p>

            <div className="detail-stock">
              <span>Stock: </span>
              {product.stock > 0 ? (
                <span className="badge badge-success">In Stock ({product.stock})</span>
              ) : (
                <span className="badge badge-danger">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="detail-actions">
                <div className="qty-wrap">
                  <label>Qty:</label>
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleAddToCart}>
                  🛒 Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {product.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((r) => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <strong>{r.name}</strong>
                    <Stars rating={r.rating} />
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {userInfo ? (
            <form className="review-form card" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              {reviewMsg && <div className={`alert ${reviewMsg.includes('added') ? 'alert-success' : 'alert-danger'}`}>{reviewMsg}</div>}
              <div className="form-group">
                <label>Rating</label>
                <Stars rating={rating} interactive onRate={setRating} />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="alert alert-info">Please <a href="/login">login</a> to write a review.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
