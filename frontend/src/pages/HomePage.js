import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', color: '#6c63ff', bg: '#1a1a3e', count: '20 items' },
  { name: 'Shoes', emoji: '👟', color: '#00d68f', bg: '#0a1f1a', count: '20 items' },
  { name: 'Accessories', emoji: '⌚', color: '#ffaa00', bg: '#1f1a0a', count: '20 items' },
  { name: 'Bags', emoji: '👜', color: '#ff6584', bg: '#1f0a14', count: '20 items' },
  { name: 'Home', emoji: '🏠', color: '#00b8d9', bg: '#0a1a1f', count: '20 items' },
  { name: 'Sports', emoji: '⚽', color: '#ff6b35', bg: '#1f140a', count: '20 items' },
];

const BRANDS = ['Nike', 'Apple', 'Samsung', 'Sony', 'Adidas', 'Puma', 'LG', 'Canon', 'Bose', 'Levi\'s'];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Verified Buyer', avatar: 'S', rating: 5, text: 'Amazing quality! Exceeded my expectations. Fast shipping and great packaging.' },
  { name: 'Marcus T.', role: 'Verified Buyer', avatar: 'M', rating: 5, text: "Best online shop I've used. Products are exactly as described. Will order again!" },
  { name: 'Anya R.', role: 'Verified Buyer', avatar: 'A', rating: 5, text: 'Incredible selection and unbeatable prices. Customer service was super helpful.' },
  { name: 'James L.', role: 'Verified Buyer', avatar: 'J', rating: 4, text: 'Great experience overall. Delivery was quick and product matched the photos.' },
];

const FEATURES = [
  { icon: '🚀', title: 'Free Shipping', desc: 'On all orders over $50' },
  { icon: '🔒', title: 'Secure Payment', desc: '256-bit SSL encryption' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
  { icon: '🎧', title: '24/7 Support', desc: 'Always here to help' },
];

const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? '#ffaa00' : '#333' }}>★</span>
    ))}
  </div>
);

const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="countdown">
      <div className="countdown-box"><span>{pad(time.h)}</span><small>HRS</small></div>
      <div className="countdown-sep">:</div>
      <div className="countdown-box"><span>{pad(time.m)}</span><small>MIN</small></div>
      <div className="countdown-sep">:</div>
      <div className="countdown-box"><span>{pad(time.s)}</span><small>SEC</small></div>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');
  const navigate = useNavigate();
  const marqueeRef = useRef(null);

  useEffect(() => {
    api.get('/products').then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${search}`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  const featured = products.slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const newArrivals = [...products].slice(-4).reverse();
  const displayProducts = activeTab === 'featured' ? featured : activeTab === 'toprated' ? topRated : newArrivals;

  return (
    <div className="homepage">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="container hero-container">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              New Season 2026 Collection
            </div>
            <h1 className="hero-heading">
              Shop The
              <span className="hero-heading-gradient"> Future</span>
              <br />Of Fashion
            </h1>
            <p className="hero-desc">
              Discover 120+ premium products across 6 categories.
              Free shipping, easy returns, and unbeatable prices.
            </p>

            <form className="hero-search-bar" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <div className="hero-tags">
              {['Headphones', 'Sneakers', 'Watches', 'Bags'].map(tag => (
                <button
                  key={tag}
                  className="hero-tag"
                  onClick={() => navigate(`/products?keyword=${tag}`)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>50K+</strong>
                <span>Customers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>120+</strong>
                <span>Products</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>99%</strong>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card-main">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                alt="Featured"
                className="hero-main-img"
              />
              <div className="hero-card-badge">
                <span>⭐ 4.9</span>
                <span>50K Reviews</span>
              </div>
            </div>

            <div className="hero-card-secondary">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"
                alt="Shoes"
                className="hero-secondary-img"
              />
              <div className="hero-secondary-info">
                <p>Running Sneakers</p>
                <strong>$89.99</strong>
              </div>
            </div>

            <div className="hero-card-float">
              <span>🚀</span>
              <div>
                <strong>Free Shipping</strong>
                <p>Orders over $50</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── MARQUEE BRANDS ── */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="marquee-item">{b}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES BAR ── */}
      <section className="features-bar">
        <div className="container features-bar-inner">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-item">
              <span className="feature-item-icon">{f.icon}</span>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow-label">EXPLORE</p>
              <h2>Shop by Category</h2>
            </div>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="cat-card"
                style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
              >
                <div className="cat-icon-wrap">
                  <span className="cat-emoji">{cat.emoji}</span>
                  <div className="cat-glow" style={{ background: cat.color }} />
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.count}</p>
                <div className="cat-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABBED PRODUCTS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow-label">COLLECTION</p>
              <h2>Our Products</h2>
            </div>
            <div className="product-tabs">
              {[
                { key: 'featured', label: 'Featured' },
                { key: 'toprated', label: 'Top Rated' },
                { key: 'new', label: 'New Arrivals' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`product-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="loader-wrap"><div className="loader" /></div>
          ) : (
            <div className="grid grid-4">
              {displayProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/products" className="btn-outline-large">Browse All 120 Products →</Link>
          </div>
        </div>
      </section>

      {/* ── PROMO GRID ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="promo-grid">
            <Link to="/products?category=Electronics" className="promo-card promo-card-big">
              <div className="promo-overlay" />
              <img src="https://images.unsplash.com/photo-1593640408182-31c228589fc4?w=700" alt="Electronics" />
              <div className="promo-content">
                <span className="promo-tag">Up to 40% OFF</span>
                <h3>Latest Electronics</h3>
                <p>Shop Now →</p>
              </div>
            </Link>
            <div className="promo-col">
              <Link to="/products?category=Shoes" className="promo-card promo-card-sm">
                <div className="promo-overlay" />
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Shoes" />
                <div className="promo-content">
                  <span className="promo-tag">New Season</span>
                  <h3>Premium Shoes</h3>
                  <p>Shop Now →</p>
                </div>
              </Link>
              <Link to="/products?category=Sports" className="promo-card promo-card-sm">
                <div className="promo-overlay" />
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400" alt="Sports" />
                <div className="promo-content">
                  <span className="promo-tag">Get Active</span>
                  <h3>Sports & Fitness</h3>
                  <p>Shop Now →</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLASH DEAL ── */}
      <section className="flash-section">
        <div className="flash-bg-glow" />
        <div className="container flash-inner">
          <div className="flash-left">
            <div className="flash-eyebrow">
              <span className="flash-dot" />
              Flash Deal — Today Only
            </div>
            <h2>Smart Watch Series X</h2>
            <p>Feature-rich smartwatch with health tracking, GPS, and 7-day battery. Limited stock!</p>

            <div className="flash-price-row">
              <span className="flash-new-price">$299.99</span>
              <span className="flash-old-price">$499.99</span>
              <span className="flash-badge">40% OFF</span>
            </div>

            <CountdownTimer />

            <div className="flash-stock-wrap">
              <div className="flash-stock-track">
                <div className="flash-stock-fill" />
              </div>
              <p>⚡ Only 3 left in stock!</p>
            </div>

            <Link to="/products" className="flash-cta-btn">
              Grab the Deal →
            </Link>
          </div>
          <div className="flash-right">
            <div className="flash-img-wrap">
              <div className="flash-img-ring" />
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                alt="Smart Watch"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header-center">
            <p className="eyebrow-label">REVIEWS</p>
            <h2>What Our Customers Say</h2>
            <p className="section-subtitle">Join 50,000+ satisfied shoppers</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="testimonial-card">
                <div className="quote-mark">"</div>
                <Stars rating={t.rating} />
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <p>✓ {t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="newsletter-glow-left" />
        <div className="newsletter-glow-right" />
        <div className="container newsletter-inner">
          <div className="newsletter-icon">📬</div>
          <h2>Get Exclusive Deals</h2>
          <p>Subscribe and get <strong>10% off</strong> your first order plus early access to sales.</p>
          <div className="newsletter-perks">
            <span>✓ No spam ever</span>
            <span>✓ Unsubscribe anytime</span>
            <span>✓ Exclusive deals only</span>
          </div>
          {subscribed ? (
            <div className="newsletter-success">
              <span>🎉</span>
              <p>You're in! Check your inbox for your discount code.</p>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe →</button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;