import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userInfo, login } = useAuth();
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    setLoading(true);
    try {
      const body = { name, email };
      if (password) body.password = password;
      const { data } = await api.put('/users/profile', body);
      login({ ...userInfo, name: data.name, email: data.email });
      setMsg('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-layout">
          <div className="card profile-card">
            <div className="profile-avatar">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{userInfo?.name}</h3>
            <p className="profile-email">{userInfo?.email}</p>
            {userInfo?.isAdmin && <span className="badge badge-success">Admin</span>}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 24 }}>Edit Profile</h3>
            {msg && <div className="alert alert-success">{msg}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>New Password <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
