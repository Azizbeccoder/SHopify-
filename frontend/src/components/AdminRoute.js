import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { userInfo } = useAuth();

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (!userInfo.isAdmin) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: 16, padding: 40,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem' }}>🚫</div>
        <h2 style={{ color: '#ff3d71' }}>Access Denied</h2>
        <p style={{ color: '#9999bb' }}>You are logged in as <strong style={{ color: '#fff' }}>{userInfo.email}</strong></p>
        <p style={{ color: '#9999bb' }}>but this account is <strong style={{ color: '#ff3d71' }}>NOT an admin</strong>.</p>
        <p style={{ color: '#9999bb' }}>Please login with <strong style={{ color: '#6c63ff' }}>admin@shop.com / admin123</strong></p>
        <a href="/login" style={{
          background: '#6c63ff', color: '#fff', padding: '12px 28px',
          borderRadius: 10, fontWeight: 600, marginTop: 8, textDecoration: 'none'
        }}>Switch Account</a>
      </div>
    );
  }

  return children;
};

export default AdminRoute;