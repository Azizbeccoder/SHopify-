import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userInfo, login } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { name, email };
      if (password) body.password = password;
      const { data } = await api.put('/users/profile', body);
      login({ ...userInfo, name: data.name, email: data.email });
      showToast('Profil muvaffaqiyatli yangilandi! ✅', 'success');
      setPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Yangilashda xato', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="profile-title">Mening Profilim</h1>
        <div className="profile-layout">
          <div className="card profile-card">
            <div className="profile-avatar">{userInfo?.name?.charAt(0).toUpperCase()}</div>
            <h3>{userInfo?.name}</h3>
            <p className="profile-email">{userInfo?.email}</p>
            {userInfo?.isAdmin && <span className="badge badge-success">Admin</span>}
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 24 }}>Profilni Tahrirlash</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ism</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Yangi Parol <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(o'zgartirmasangiz bo'sh qoldiring)</span></label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Yangi parol" />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;