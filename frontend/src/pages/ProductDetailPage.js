import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RecentlyViewed, { addToRecentlyViewed } from '../components/RecentlyViewed';
import RelatedProducts from '../components/RelatedProducts';
import './ProductDetailPage.css';
import '../components/RecentlyViewed.css';
import '../components/RelatedProducts.css';

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
  const [activeImg, setActiveImg] = useState(0);

  const fetchProduct = () => {
    setLoading(true);
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setLoading(false);
      addToRecentlyViewed(res.data);
    });
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const handleAddToCart = () => { addToCart(product, qty); navigate('/cart'); };

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
          <div className="detail-img-section">
            <div className="detail-img-main">
              <img src={product.image} alt={product.name} />
              {product.stock === 0 && (
                <div className="sold-out-overlay">OUT OF STOCK</div>
              )}
            </div>
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

            <div className="detail-stock-row">
              <span style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>Availability:</span>
              {product.stock > 10
                ? <span className="badge badge-success">✓ In Stock</span>
                : product.stock > 0
                  ? <span className="badge badge-warning">⚠ Only {product.stock} left</span>
                  : <span className="badge badge-danger">Out of Stock</span>}
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

            {/* Product Meta */}
            <div className="detail-meta-info">
              <div><span>Category:</span><strong>{product.category}</strong></div>
              <div><span>Rating:</span><strong>⭐ {product.rating}/5</strong></div>
              <div><span>Reviews:</span><strong>{product.numReviews} customers</strong></div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts category={product.category} currentId={product._id} />

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews ({product.numReviews})</h2>

          {product.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((r) => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{r.name.charAt(0)}</div>
                    <div>
                      <strong>{r.name}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Stars rating={r.rating} />
                        <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.7 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {userInfo ? (
            <form className="review-form card" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              {reviewMsg && <div className={`alert ${reviewMsg.includes('added') ? 'alert-success' : 'alert-danger'}`}>{reviewMsg}</div>}
              <div className="form-group">
                <label>Your Rating</label>
                <Stars rating={rating} interactive onRate={setRating} />
              </div>
              <div className="form-group">
                <label>Your Comment</label>
                <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required placeholder="Share your experience..." />
              </div>
              <button className="btn btn-primary" type="submit" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="alert alert-info">Please <a href="/login" style={{ color: 'var(--primary)' }}>login</a> to write a review.</div>
          )}
        </div>

        {/* Recently Viewed */}
        <RecentlyViewed currentId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;