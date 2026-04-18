import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './AdminPage.css';

const EMPTY = { name: '', description: '', price: '', category: '', image: '', stock: '' };
const CATEGORIES = ['Electronics', 'Shoes', 'Accessories', 'Bags', 'Home', 'Sports'];

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    api.get('/products').then((res) => {
      setProducts(res.data);
      setFiltered(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ));
  }, [search, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form);
        setMsg({ text: '✓ Product updated successfully!', type: 'success' });
      } else {
        await api.post('/products', form);
        setMsg({ text: '✓ Product created successfully!', type: 'success' });
      }
      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error saving product', type: 'error' });
    }
    setSaving(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    setEditId(p._id);
    setShowForm(true);
    setMsg({ text: '', type: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteId(null);
      setMsg({ text: '✓ Product deleted.', type: 'success' });
      fetchProducts();
    } catch (err) {
      setMsg({ text: 'Error deleting product', type: 'error' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(EMPTY);
    setEditId(null);
    setMsg({ text: '', type: '' });
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>Products</h1>
            <p>{products.length} products in your store</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); setMsg({ text: '', type: '' }); }}
          >
            + Add Product
          </button>
        </div>

        {msg.text && (
          <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {msg.text}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="admin-form-panel">
            <h3>{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Premium Wireless Headphones"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="Describe the product..."
                />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number" step="0.01" min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number" min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Image Preview */}
              {form.image && (
                <div className="form-group">
                  <label>Image Preview</label>
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              <div className="form-actions-row">
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editId ? '✓ Update Product' : '✓ Create Product'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>All Products ({filtered.length})</h3>
            <div className="table-search">
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loader-wrap"><div className="loader" /></div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📦</div>
              <p>No products found.</p>
            </div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="table-product-info">
                          <img src={p.image} alt={p.name} className="table-product-img" />
                          <div>
                            <div className="table-product-name">{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: 2 }}>
                              #{p._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-warning">{p.category}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                          {p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--warning)' }}>★</span>
                        <span style={{ marginLeft: 4 }}>{p.rating} ({p.numReviews})</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>
                            ✏️ Edit
                          </button>
                          {deleteId === p._id ? (
                            <>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                                Confirm
                              </button>
                              <button className="btn btn-secondary btn-sm" onClick={() => setDeleteId(null)}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}>
                              🗑 Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;