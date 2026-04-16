import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', count: '240+ items' },
  { name: 'Shoes', icon: '👟', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', count: '180+ items' },
  { name: 'Accessories', icon: '⌚', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', count: '320+ items' },
  { name: 'Bags', icon: '👜', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', count: '95+ items' },
  { name: 'Home', icon: '🏠', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', count: '410+ items' },
  { name: 'Sports', icon: '⚽', image: 'https://images.unsplash.com/photo-1601925228997-2c27c8e49bc4?w=400', count: '150+ items' },
];

const BANNERS = [
  {
    tag: '🔥 Limited Time Deal',
    title: 'Premium Tech',
    titleAccent: 'At Half Price',
    sub: 'Unbeatable deals on the latest electronics. Free shipping on all orders over $50.',
    cta: 'Shop Electronics',
    link: '/products?category=Electronics',
    bg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 100%)',
    accent: '#6c63ff',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  },
  {
    tag: '👟 New Arrivals',
    title: 'Step Into',
    titleAccent: 'Style 2026',
    sub: 'The freshest kicks for every occasion. From casual to performance, find your perfect pair.',
    cta: 'Shop Shoes',
    link: '/products?category=Shoes',
    bg: 'linear-gradient(135deg, #0a1628 0%, #0d1f0d 100%)',
    accent: '#00d68f',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    tag: '⌚ Best Sellers',
    title: 'Luxury Watches',
    titleAccent: 'For Less',
    sub: 'Timeless elegance meets modern technology. Discover our curated collection of premium timepieces.',
    cta: 'Shop Accessories',
    link: '/products?category=Accessories',
    bg: 'linear-gradient(135deg, #1a0a0a 0%, #1f0d0d 100%)',
    accent: '#ffaa00',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Verified Buyer', avatar: 'S', rating: 5, text: 'Amazing quality! The headphones I ordered exceeded my expectations. Fast shipping and great packaging.' },
  { name: 'Marcus T.', role: 'Verified Buyer', avatar: 'M', rating: 5, text: "Best online shop I've used. The sneakers are exactly as described and arrived in 2 days. Will order again!" },
  { name: 'Anya R.', role: 'Verified Buyer', avatar: 'A', rating: 5, text: 'Incredible selection and unbeatable prices. The smart watch I bought is fantastic. Customer service was super helpful.' },
  { name: 'James L.', role: 'Verified Buyer', avatar: 'J', rating: 4, text: 'Great experience overall. The backpack is sturdy and stylish. Delivery was quick and product matched the photos.' },
];

const STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '1,200+', label: 'Products' },
  { value: '99%', label: 'Satisfaction' },
  { value: '2-Day', label: 'Fast Delivery' },
];

const FEATURES = [
  { icon: '🚀', title: 'Free Fast Shipping', desc: 'Free delivery on all orders over $50. Express options available at checkout.' },
  { icon: '🔒', title: 'Secure Payments', desc: '256-bit SSL encryption. Your payment information is always protected.' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy. No questions asked, full refund guaranteed.' },
  { icon: '🎧', title: '24/7 Support', desc: 'Our support team is always ready to help you with any questions.' },
];

const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? 'star' : 'star star-empty'}>★</span>
    ))}
  </div>
);

const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 8, m: 45, s: 30 });

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
    <div className="flash-timer">
      <div className="timer-box"><strong>{pad(time.h)}</strong><span>Hours</span></div>
      <div className="timer-sep">:</div>
      <div className="timer-box"><strong>{pad(time.m)}</strong><span>Mins</span></div>
      <div className="timer-sep">:</div>
      <div className="timer-box"><strong>{pad(time.s)}</strong><span>Secs</span></div>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroBanner, setHeroBanner] = useState(0);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    api.get('/products').then((res) => { setProducts(res.data); setLoading(false); });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setHeroBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
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

  const banner = BANNERS[heroBanner];
  const featured = products.slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const newArrivals = [...products].reverse().slice(0, 4);

  return (
    <div className="homepage">

      {/* ── HERO SLIDER ── */}
      <section className="hero" style={{ background: banner.bg }}>
        <div className="hero-glow" style={{ background: `radial-gradient(circle at 70% 50%, ${banner.accent}33 0%, transparent 65%)` }} />
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-tag" style={{ borderColor: `${banner.accent}66`, color: banner.accent, background: `${banner.accent}15` }}>
              {banner.tag}
            </span>
            <h1 className="hero-title">
              {banner.title}<br />
              <em style={{ color: banner.accent, fontStyle: 'normal' }}>{banner.titleAccent}</em>
            </h1>
            <p className="hero-sub">{banner.sub}</p>

            <form className="hero-search" onSubmit={handleSearch}>
              <span className="hero-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for products, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" style={{ background: banner.accent }}>Search</button>
            </form>

            <div className="hero-btns">
              <Link to={banner.link} className="btn-hero-primary" style={{ background: banner.accent }}>
                {banner.cta} →
              </Link>
              <Link to="/products" className="btn-hero-secondary">Browse All</Link>
            </div>

            <div className="hero-dots">
              {BANNERS.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === heroBanner ? 'active' : ''}`}
                  style={i === heroBanner ? { background: banner.accent, width: 28 } : {}}
                  onClick={() => { setHeroBanner(i); clearInterval(timerRef.current); }}
                />
              ))}
            </div>
          </div>

          <div className="hero-image-wrap">
            <div className="hero-image-glow" style={{ background: `radial-gradient(circle, ${banner.accent}44, transparent 70%)` }} />
            <img key={heroBanner} src={banner.image} alt="Featured" className="hero-image" />
            <div className="hero-badge-float hero-badge-1">
              <span>⭐</span>
              <div>
                <strong>4.9/5</strong>
                <p>50K+ Reviews</p>
              </div>
            </div>
            <div className="hero-badge-float hero-badge-2" style={{ borderColor: `${banner.accent}44` }}>
              <span>🚀</span>
              <div>
                <strong>Free Shipping</strong>
                <p>Orders over $50</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats-bar">
        <div className="container stats-inner">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-item">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
              {i < STATS.length - 1 && <div className="stat-divider" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section section">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-tag">Browse</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link to="/products" className="see-all-btn">View All →</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="category-card">
                <div className="category-img-wrap">
                  <img src={cat.image} alt={cat.name} />
                  <div className="category-overlay" />
                </div>
                <div className="category-info">
                  <span className="category-icon-badge">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-tag">Hand Picked</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="see-all-btn">See All →</Link>
          </div>
          {loading ? <div className="loader-wrap"><div className="loader" /></div> : (
            <div className="grid grid-4">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── PROMO SPLIT BANNER ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="promo-split-grid">
            <Link to="/products?category=Electronics" className="promo-card promo-large">
              <img src="https://images.unsplash.com/photo-1593640408182-31c228589fc4?w=700" alt="Electronics" />
              <div className="promo-card-overlay" />
              <div className="promo-card-content">
                <span>Up to 40% off</span>
                <h3>Latest Electronics</h3>
                <div className="promo-cta">Shop Now →</div>
              </div>
            </Link>
            <div className="promo-stack">
              <Link to="/products?category=Bags" className="promo-card promo-small">
                <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" alt="Bags" />
                <div className="promo-card-overlay" />
                <div className="promo-card-content">
                  <span>New Season</span>
                  <h3>Premium Bags</h3>
                  <div className="promo-cta">Shop Now →</div>
                </div>
              </Link>
              <Link to="/products?category=Sports" className="promo-card promo-small">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" alt="Sports" />
                <div className="promo-card-overlay" />
                <div className="promo-card-content">
                  <span>Get Active</span>
                  <h3>Sports & Fitness</h3>
                  <div className="promo-cta">Shop Now →</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP RATED ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-tag">⭐ Top Picks</p>
              <h2 className="section-title">Highest Rated</h2>
            </div>
            <Link to="/products" className="see-all-btn">See All →</Link>
          </div>
          {loading ? <div className="loader-wrap"><div className="loader" /></div> : (
            <div className="grid grid-4">
              {topRated.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── FLASH DEAL ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="flash-deal-inner">
            <div className="flash-deal-text">
              <span className="flash-tag">⚡ Flash Deal — Today Only</span>
              <h2>Smart Watch Series X</h2>
              <p>Feature-rich smartwatch with health tracking, GPS, and 7-day battery life. Limited stock — grab it before it's gone!</p>
              <div className="flash-price-row">
                <span className="flash-current">$299.99</span>
                <span className="flash-original">$499.99</span>
                <span className="flash-discount">40% OFF</span>
              </div>
              <CountdownTimer />
              <div className="flash-stock">
                <div className="flash-stock-bar">
                  <div className="flash-stock-fill" style={{ width: '72%' }} />
                </div>
                <p>72% sold — only 3 left!</p>
              </div>
              <Link to="/products" className="btn btn-primary">Grab the Deal →</Link>
            </div>
            <div className="flash-deal-img">
              <div className="flash-deal-glow" />
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" alt="Flash Deal" />
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-tag">Just In</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/products" className="see-all-btn">See All →</Link>
          </div>
          {loading ? <div className="loader-wrap"><div className="loader" /></div> : (
            <div className="grid grid-4">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 40 }}>
            <p className="section-tag">💬 Customer Reviews</p>
            <h2 className="section-title">What People Are Saying</h2>
            <p className="section-sub">Join 50,000+ satisfied shoppers who love ShopZone</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <Stars rating={t.rating} />
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <p>{t.role} ✓</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="newsletter-bg" />
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <h2>Get Exclusive Deals in Your Inbox</h2>
              <p>Subscribe and be the first to know about flash sales, new arrivals and special discounts.</p>
              <div className="newsletter-perks">
                <span>✓ 10% off your first order</span>
                <span>✓ Early access to sales</span>
                <span>✓ No spam, ever</span>
              </div>
            </div>
            <div className="newsletter-form-wrap">
              {subscribed ? (
                <div className="newsletter-success">
                  <span className="success-icon">🎉</span>
                  <h3>You're subscribed!</h3>
                  <p>Check your inbox for your 10% discount code.</p>
                </div>
              ) : (
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Subscribe →</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;