import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './AdminPage.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    api.get('/users').then((res) => {
      setUsers(res.data);
      setFiltered(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter === 'admin') result = result.filter(u => u.isAdmin);
    if (roleFilter === 'user') result = result.filter(u => !u.isAdmin);
    setFiltered(result);
  }, [search, roleFilter, users]);

  const adminCount = users.filter(u => u.isAdmin).length;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>Users</h1>
            <p>{users.length} registered users — {adminCount} admin{adminCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(108,99,255,0.15)' }}>👥</div>
            <div className="admin-stat-info">
              <strong style={{ color: 'var(--primary)' }}>{users.length}</strong>
              <span>Total Users</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(0,214,143,0.12)' }}>🛡</div>
            <div className="admin-stat-info">
              <strong style={{ color: 'var(--success)' }}>{adminCount}</strong>
              <span>Admins</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(255,170,0,0.12)' }}>👤</div>
            <div className="admin-stat-info">
              <strong style={{ color: 'var(--warning)' }}>{users.length - adminCount}</strong>
              <span>Regular Users</span>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-card-header">
            <h3>All Users ({filtered.length})</h3>
            <div className="table-search" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'admin', 'user'].map(r => (
                  <button
                    key={r}
                    className={`filter-pill ${roleFilter === r ? 'active' : ''}`}
                    onClick={() => setRoleFilter(r)}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loader-wrap"><div className="loader" /></div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">👤</div>
              <p>No users found.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="table-user-info">
                        <div
                          className="table-user-avatar"
                          style={{
                            background: u.isAdmin
                              ? 'linear-gradient(135deg, #6c63ff, #ff6584)'
                              : 'linear-gradient(135deg, #00d68f, #0095ff)'
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{u.name}</div>
                          {u.isAdmin && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>Administrator</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>{u.email}</td>
                    <td>
                      {u.isAdmin
                        ? <span className="badge badge-success">🛡 Admin</span>
                        : <span className="badge badge-warning">👤 User</span>}
                    </td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--gray)', fontSize: '0.78rem' }}>
                      #{u._id.slice(-8)}
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

export default AdminUsersPage;