import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './AdminPage.css';

const EMPTY = { name: '', description: '', price: '', category: '', image: '', stock: '' };

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetch = () => {
    api.get('/products').then((res) => { setProducts(res.data); setLoading(false); });
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form);
        setMsg('Product updated!');
      } else {
        await api.post('/products', form);
        setMsg('Product created!');
      }
      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      fetch();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    setEditId(p._id);
    setShowForm(true);
    setMsg('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetch();
  };

  const handleCancel = () => { setShowForm(false); setForm(EMPTY); setEditId(null); setMsg(''); };

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <h1>Products Management</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }}>
            + Add Product
          </button>
        </div>

        {msg && <div className={`alert ${msg.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{msg}</div>}

        {showForm && (
          <div className="card mb-3">
            <h3>{editId ? 'Edit Product' : 'New Product'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="Electronics, Shoes..." />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editId ? 'Update' : 'Create'}</button>
                <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} /></td>
                    <td style={{ maxWidth: 200 }}><span style={{ fontWeight: 500 }}>{p.name}</span></td>
                    <td><span className="badge badge-warning">{p.category}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${p.price}</td>
                    <td>
                      <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
