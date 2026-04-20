import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', label: 'TECH', color: '#1a1a1a', accent: '#fff' },
  { name: 'Shoes', label: 'KICKS', color: '#e63b2a', accent: '#fff' },
  { name: 'Accessories', label: 'ACCESS', color: '#1a1a1a', accent: '#fff' },
  { name: 'Bags', label: 'BAGS', color: '#f2f0eb', accent: '#111' },
  { name: 'Home', label: 'HOME', color: '#1a1a1a', accent: '#fff' },
  { name: 'Sports', label: 'SPORT', color: '#e63b2a', accent: '#fff' },
];

const DROPS = [
  { tag: 'NEW DROP', title: 'SMART\nWATCH', sub: 'Series X — Track everything', price: '$299', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Electronics' },
  { tag: 'HOT NOW', title: 'FRESH\nKICKS', sub: 'Running Sneakers Pro — Built for speed', price: '$89', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'Shoes' },
  { tag: 'LIMITED', title: 'CARRY\nIT ALL', sub: 'Leather Messenger — Built to last', price: '$149', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', category: 'Bags' },
];

const TESTIMONIALS = [
  { name: 'SARAH K.', text: 'Best online store. Period.', rating: 5 },
  { name: 'MARCUS T.', text: 'Fast shipping. Great quality.', rating: 5 },
  { name: 'ANYA R.', text: 'Prices are unbeatable.', rating: 5 },
  { name: 'JAMES L.', text: 'Will order again for sure.', rating: 4 },
];

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
    <div className="e-countdown">
      <div className="e-timer-block"><span>{pad(time.h)}</span><small>HRS</small></div>
      <div className="e-timer-sep">:</div>
      <div className="e-timer-block"><span>{pad(time.m)}</span><small>MIN</small></div>
      <div className="e-timer-sep">:</div>
      <div className="e-timer-block"><span>{pad(time.s)}</span><small>SEC</small></div>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDrop, setActiveDrop] = useState(0);
  const [activeTab, setActiveTab] = useState('new');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const marqueeRef = useRef(null);

  useEffect(() => {
    api.get('/products').then((res) => { setProducts(res.data); setLoading(false); });
  }, []);

  // Auto rotate drops
  useEffect(() => {
    const t = setInterval(() => setActiveDrop(p => (p + 1) % DROPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${search}`);
  };

  const drop = DROPS[activeDrop];
  const newArrivals = [...products].slice(-4).reverse();
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const featured = products.slice(0, 4);
  const displayProducts = activeTab === 'new' ? newArrivals : activeTab === 'top' ? topRated : featured;

  return (
    <div className="e-page">

      {/* ── TICKER ── */}
      <div className="e-ticker">
        <div className="e-ticker-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="e-ticker-item">
              FREE SHIPPING OVER $50 &nbsp;★&nbsp; NEW DROPS WEEKLY &nbsp;★&nbsp; 30-DAY RETURNS &nbsp;★&nbsp; 120+ PRODUCTS &nbsp;★&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="e-hero">
        <div className="e-hero-grid">

          {/* Left — Big Type */}
          <div className="e-hero-left">
            <div className="e-hero-eyebrow">
              <span className="e-dot" />
              {drop.tag}
            </div>
            <h1 className="e-hero-heading">
              {drop.title.split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'e-heading-accent' : ''}>{line}<br /></span>
              ))}
            </h1>
            <p className="e-hero-sub">{drop.sub}</p>

            <form className="e-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">GO</button>
            </form>

            <div className="e-hero-actions">
              <Link to={`/products?category=${drop.category}`} className="e-btn-primary">
                SHOP THE DROP
              </Link>
              <Link to="/products" className="e-btn-ghost">VIEW ALL →</Link>
            </div>

            {/* Drop selector */}
            <div className="e-drop-selector">
              {DROPS.map((d, i) => (
                <button
                  key={i}
                  className={`e-drop-dot ${i === activeDrop ? 'active' : ''}`}
                  onClick={() => setActiveDrop(i)}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="e-hero-stats">
              <div className="e-stat"><strong>50K+</strong><span>CUSTOMERS</span></div>
              <div className="e-stat-line" />
              <div className="e-stat"><strong>120+</strong><span>PRODUCTS</span></div>
              <div className="e-stat-line" />
              <div className="e-stat"><strong>99%</strong><span>SATISFACTION</span></div>
            </div>
          </div>

          {/* Right — Image */}
          <div className="e-hero-right">
            <div className="e-hero-img-wrap">
              <img key={activeDrop} src={drop.img} alt={drop.title} className="e-hero-img" />
              <div className="e-hero-price-tag">
                <span>FROM</span>
                <strong>{drop.price}</strong>
              </div>
              <div className="e-hero-img-label">
                <span>NEW SEASON 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP ── */}
      <section className="e-cat-strip">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to={`/products?category=${cat.name}`}
            className="e-cat-item"
            style={{ background: cat.color, color: cat.accent }}
          >
            <span className="e-cat-label">{cat.label}</span>
            <span className="e-cat-arrow">→</span>
          </Link>
        ))}
      </section>

      {/* ── MARQUEE ── */}
      <div className="e-marquee">
        <div className="e-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="e-marquee-set">
              SHOP NOW &nbsp;/&nbsp; NEW DROPS &nbsp;/&nbsp; BEST SELLERS &nbsp;/&nbsp; FREE SHIPPING &nbsp;/&nbsp; SALE ON NOW &nbsp;/&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="e-section">
        <div className="container">
          <div className="e-section-header">
            <div className="e-section-title-wrap">
              <span className="e-section-number">01</span>
              <h2 className="e-section-title">THE COLLECTION</h2>
            </div>
            <div className="e-tabs">
              {[
                { key: 'new', label: 'NEW IN' },
                { key: 'top', label: 'TOP RATED' },
                { key: 'featured', label: 'FEATURED' },
              ].map((t) => (
                <button
                  key={t.key}
                  className={`e-tab ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
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

          <div className="e-browse-all">
            <Link to="/products" className="e-btn-outline-wide">
              BROWSE ALL 120 PRODUCTS →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPLIT PROMO ── */}
      <section className="e-split-promo">
        <Link to="/products?category=Electronics" className="e-promo-half e-promo-dark">
          <div className="e-promo-content">
            <span className="e-promo-tag">UP TO 40% OFF</span>
            <h3>TECH<br />DEALS</h3>
            <p>Shop Electronics →</p>
          </div>
          <img src="https://images.unsplash.com/photo-1593640408182-31c228589fc4?w=700" alt="Electronics" />
        </Link>
        <Link to="/products?category=Sports" className="e-promo-half e-promo-red">
          <div className="e-promo-content">
            <span className="e-promo-tag">NEW SEASON</span>
            <h3>GET<br />ACTIVE</h3>
            <p>Shop Sports →</p>
          </div>
          <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700" alt="Sports" />
        </Link>
      </section>

      {/* ── FLASH DEAL ── */}
      <section className="e-flash">
        <div className="container">
          <div className="e-flash-inner">
            <div className="e-flash-left">
              <div className="e-flash-eyebrow">
                <span className="e-flash-live" />
                FLASH DEAL — TODAY ONLY
              </div>
              <h2 className="e-flash-title">SMART<br /><span>WATCH</span><br />SERIES X</h2>
              <div className="e-flash-prices">
                <span className="e-price-new">$299</span>
                <span className="e-price-old">$499</span>
                <span className="e-price-badge">−40%</span>
              </div>
              <CountdownTimer />
              <div className="e-stock-bar-wrap">
                <div className="e-stock-bar"><div className="e-stock-fill" /></div>
                <span>72% SOLD — 3 LEFT</span>
              </div>
              <Link to="/products" className="e-btn-primary" style={{ display: 'inline-flex', marginTop: 8 }}>
                GRAB THE DEAL →
              </Link>
            </div>

            <div className="e-flash-right">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
                alt="Smart Watch"
              />
              <div className="e-flash-sticker">
                <span>HOT</span>
                <span>DEAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section className="e-section">
        <div className="container">
          <div className="e-section-header">
            <div className="e-section-title-wrap">
              <span className="e-section-number">02</span>
              <h2 className="e-section-title">SHOP BY CATEGORY</h2>
            </div>
            <Link to="/products" className="e-btn-ghost">ALL CATEGORIES →</Link>
          </div>
          <div className="e-cat-grid">
            {[
              { name: 'Electronics', emoji: '💻', count: '20', bg: '#111' },
              { name: 'Shoes', emoji: '👟', count: '20', bg: '#e63b2a' },
              { name: 'Accessories', emoji: '⌚', count: '20', bg: '#222' },
              { name: 'Bags', emoji: '👜', count: '20', bg: '#f2f0eb', dark: true },
              { name: 'Home', emoji: '🏠', count: '20', bg: '#333' },
              { name: 'Sports', emoji: '⚽', count: '20', bg: '#e63b2a' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="e-cat-card"
                style={{ background: cat.bg }}
              >
                <span className="e-cat-card-emoji">{cat.emoji}</span>
                <div className="e-cat-card-info">
                  <strong style={{ color: cat.dark ? '#111' : '#fff' }}>{cat.name.toUpperCase()}</strong>
                  <span style={{ color: cat.dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }}>{cat.count} ITEMS</span>
                </div>
                <span className="e-cat-card-arrow" style={{ color: cat.dark ? '#111' : '#fff' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="e-testimonials">
        <div className="container">
          <div className="e-section-header">
            <div className="e-section-title-wrap">
              <span className="e-section-number">03</span>
              <h2 className="e-section-title">WHAT THEY SAY</h2>
            </div>
          </div>
          <div className="e-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="e-testimonial">
                <div className="e-testimonial-stars">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="e-testimonial-text">"{t.text}"</p>
                <span className="e-testimonial-name">— {t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="e-newsletter">
        <div className="container e-newsletter-inner">
          <div className="e-newsletter-left">
            <h2 className="e-newsletter-title">DON'T<br />MISS<br /><span>A DROP.</span></h2>
            <p>Subscribe for exclusive deals, early access and weekly drops.</p>
          </div>
          <div className="e-newsletter-right">
            {subscribed ? (
              <div className="e-subscribed">
                <span>✓</span>
                <p>YOU'RE IN. CHECK YOUR INBOX FOR 10% OFF.</p>
              </div>
            ) : (
              <form className="e-newsletter-form" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
                <input
                  type="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">SUBSCRIBE →</button>
              </form>
            )}
            <div className="e-newsletter-perks">
              <span>✓ 10% OFF FIRST ORDER</span>
              <span>✓ EARLY ACCESS</span>
              <span>✓ NO SPAM</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;