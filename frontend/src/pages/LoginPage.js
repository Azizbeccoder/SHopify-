import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './AuthPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      showToast(`Xush kelibsiz, ${data.name}! 👋`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login muvaffaqiyatsiz', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">⚡ ShopZone</div>
        <h2>Xush kelibsiz</h2>
        <p className="auth-sub">Hisobingizga kiring</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="siz@email.com" />
          </div>
          <div className="form-group">
            <label>Parol</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>
        <p className="auth-switch">
          Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'ting</Link>
        </p>
        <div className="auth-demo">
          <p>Demo:</p>
          <code>admin@shop.com / admin123</code><br />
          <code>john@example.com / john123</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;