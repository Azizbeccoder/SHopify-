import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './AuthPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      showToast('Parollar mos kelmaydi!', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data);
      showToast(`Xush kelibsiz, ${data.name}! Hisob yaratildi 🎉`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xato', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">⚡ ShopZone</div>
        <h2>Hisob yaratish</h2>
        <p className="auth-sub">Minglab xaridorlar qatoriga qo'shiling</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ismingiz</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Ismingiz" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="siz@email.com" />
          </div>
          <div className="form-group">
            <label>Parol</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Kamida 6 belgi" />
          </div>
          <div className="form-group">
            <label>Parolni tasdiqlang</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Parolni qayta kiriting" />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Yaratilmoqda...' : 'Hisob Yaratish'}
          </button>
        </form>
        <p className="auth-switch">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;