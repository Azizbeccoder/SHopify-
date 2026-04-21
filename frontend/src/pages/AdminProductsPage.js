import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import './AdminPage.css';

const EMPTY = { name: '', description: '', price: '', category: '', image: '', stock: '' };
const CATEGORIES = ['Electronics', 'Shoes', 'Accessories', 'Bags', 'Home', 'Sports'];

const StockBadge = ({ stock }) => {
  if (stock === 0) return <span className="badge badge-danger">🔴 Tugagan</span>;
  if (stock <= 5) return <span className="badge badge-warning">⚠️ Kam: {stock}</span>;
  return <span className="badge badge-success">{stock} ta bor</span>;
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const fetchProducts = () => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setFiltered(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (stockFilter === 'low') result = result.filter(p => p.stock > 0 && p.stock <= 5);
    if (stockFilter === 'out') result = result.filter(p => p.stock === 0);
    if (stockFilter === 'ok') result = result.filter(p => p.stock > 5);
    setFiltered(result);
  }, [search, stockFilter, products]);

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form);
        showToast('Mahsulot yangilandi! ✅', 'success');
      } else {
        await api.post('/products', form);
        showToast('Yangi mahsulot yaratildi! ✅', 'success');
      }
      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Xato yuz berdi', 'error');
    }
    setSaving(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    setEditId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteId(null);
      showToast('Mahsulot o\'chirildi', 'info');
      fetchProducts();
    } catch {
      showToast('O\'chirishda xato', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>Mahsulotlar</h1>
            <p>Jami {products.length} ta mahsulot</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }}>
            + Yangi Mahsulot
          </button>
        </div>

        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {outOfStockCount > 0 && (
              <div className="alert alert-danger" style={{ flex: 1, minWidth: 200, cursor: 'pointer' }} onClick={() => setStockFilter('out')}>
                🔴 <strong>{outOfStockCount} ta mahsulot tugagan</strong> — Ko'rish uchun bosing
              </div>
            )}
            {lowStockCount > 0 && (
              <div className="alert alert-info" style={{ flex: 1, minWidth: 200, cursor: 'pointer' }} onClick={() => setStockFilter('low')}>
                ⚠️ <strong>{lowStockCount} ta mahsulot kam qolgan</strong> (5 ta yoki kamroq)
              </div>
            )}
          </div>
        )}

        {showForm && (
          <div className="admin-form-panel">
            <h3>{editId ? '✏️ Mahsulotni Tahrirlash' : '➕ Yangi Mahsulot'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Mahsulot nomi</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Kategoriya</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Tanlang...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tavsif</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Narx ($)</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Ombor soni</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Rasm URL</label>
                  <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              {form.image && (
                <div className="form-group">
                  <label>Ko'rinish</label>
                  <img src={form.image} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} onError={e => e.target.style.display='none'} />
                </div>
              )}
              <div className="form-actions-row">
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saqlanmoqda...' : editId ? '✓ Yangilash' : '✓ Yaratish'}</button>
                <button className="btn btn-secondary" type="button" onClick={() => { setShowForm(false); setForm(EMPTY); setEditId(null); }}>Bekor qilish</button>
              </div>
            </form>
          </div>
        )}

        <div className="table-card">
          <div className="table-card-header">
            <h3>Barcha Mahsulotlar ({filtered.length})</h3>
            <div className="table-search" style={{ gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{key:'all',label:'Barchasi'},{key:'ok',label:'✅ Bor'},{key:'low',label:'⚠️ Kam'},{key:'out',label:'🔴 Tugagan'}].map(f => (
                  <button key={f.key} className={`filter-pill ${stockFilter===f.key?'active':''}`} onClick={() => setStockFilter(f.key)}>{f.label}</button>
                ))}
              </div>
              <input type="text" placeholder="🔍 Qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loading ? (
            <div className="loader-wrap"><div className="loader" /></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Mahsulot</th><th>Kategoriya</th><th>Narx</th><th>Ombor</th><th>Reyting</th><th>Amallar</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id} style={p.stock===0?{background:'rgba(255,61,113,0.04)'}:p.stock<=5?{background:'rgba(255,170,0,0.04)'}:{}}>
                    <td>
                      <div className="table-product-info">
                        <img src={p.image} alt={p.name} className="table-product-img" />
                        <div>
                          <div className="table-product-name">{p.name}</div>
                          <div style={{ fontSize:'0.72rem', color:'var(--gray)' }}>#{p._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-warning">{p.category}</span></td>
                    <td style={{ fontWeight:700, color:'var(--primary)' }}>${Number(p.price).toFixed(2)}</td>
                    <td><StockBadge stock={p.stock} /></td>
                    <td><span style={{ color:'var(--warning)' }}>★</span> {p.rating} ({p.numReviews})</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>✏️ Tahrir</button>
                        {deleteId===p._id ? (
                          <>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Tasdiqlash</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setDeleteId(null)}>Bekor</button>
                          </>
                        ) : (
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}>🗑 O'chirish</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;