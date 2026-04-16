import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then((res) => { setUsers(res.data); setLoading(false); });
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <h1>Users Management</h1>
          <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{users.length} users total</span>
        </div>

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32,
                          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray)' }}>{u.email}</td>
                    <td>
                      {u.isAdmin
                        ? <span className="badge badge-success">Admin</span>
                        : <span className="badge badge-warning">User</span>}
                    </td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
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

export default AdminUsersPage;
