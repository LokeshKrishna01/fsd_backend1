import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import '../styles/Dashboard.css';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [modal, setModal] = useState(null); // { userId, email, action: 'grant'|'revoke' }
    const [reason, setReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getUsers();
            setUsers(res.data.data);
        } catch {
            showAlert('error', 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        try {
            setHistoryLoading(true);
            const res = await adminAPI.getAccessHistory();
            setHistory(res.data.data);
        } catch {
            showAlert('error', 'Failed to load access history.');
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, fetchHistory]);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 4000);
    };

    const openModal = (user, action) => {
        setReason('');
        setModal({ userId: user._id, email: user.email, action });
    };

    const closeModal = () => {
        setModal(null);
        setReason('');
    };

    const handleConfirm = async () => {
        if (!modal) return;
        setActionLoading(true);
        try {
            if (modal.action === 'grant') {
                await adminAPI.grantAccess(modal.userId, reason);
                showAlert('success', `✅ Access granted to ${modal.email}`);
            } else {
                await adminAPI.revokeAccess(modal.userId, reason);
                showAlert('success', `🚫 Access revoked from ${modal.email}`);
            }
            closeModal();
            fetchUsers();
        } catch (err) {
            showAlert('error', err.response?.data?.message || 'Action failed. Please try again.');
            closeModal();
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const totalUsers = users.filter(u => u.role === 'USER').length;
    const activeUsers = users.filter(u => u.role === 'USER' && u.accessStatus === 'active').length;
    const revokedUsers = users.filter(u => u.accessStatus === 'revoked').length;
    const pendingUsers = users.filter(u => u.accessStatus === 'pending').length;

    const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="dashboard-wrapper">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-brand">
                    <div className="brand-icon">🛡️</div>
                    <h1>Access Manager</h1>
                    <span className="role-badge">Admin</span>
                </div>
                <div className="header-right">
                    <span className="header-user">Logged in as <span>{admin.email}</span></span>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className="dashboard-main">
                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">👥</span>
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{totalUsers}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">✅</span>
                        <span className="stat-label">Active</span>
                        <span className="stat-value">{activeUsers}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">⏳</span>
                        <span className="stat-label">Pending</span>
                        <span className="stat-value">{pendingUsers}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🚫</span>
                        <span className="stat-label">Revoked</span>
                        <span className="stat-value">{revokedUsers}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👤 Users
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        📋 Access History
                    </button>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="dashboard-card">
                        <h2 className="card-title">👤 User Management</h2>
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading users...</p>
                            </div>
                        ) : users.filter(u => u.role === 'USER').length === 0 ? (
                            <div className="empty-state">
                                <p>No users registered yet. Users will appear here once they sign up.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter(u => u.role === 'USER').map(user => (
                                            <tr key={user._id}>
                                                <td className="user-email">{user.email}</td>
                                                <td>
                                                    {user.accessStatus === 'active' && (
                                                        <span className="status-badge status-active">● Active</span>
                                                    )}
                                                    {user.accessStatus === 'revoked' && (
                                                        <span className="status-badge status-revoked">● Revoked</span>
                                                    )}
                                                    {user.accessStatus === 'pending' && (
                                                        <span className="status-badge status-pending">⏳ Pending</span>
                                                    )}
                                                </td>
                                                <td className="timestamp">{formatDate(user.createdAt)}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-grant"
                                                            onClick={() => openModal(user, 'grant')}
                                                            disabled={user.accessStatus === 'active'}
                                                            title={user.accessStatus === 'active' ? 'Already active' : 'Grant access'}
                                                        >
                                                            ✓ Grant
                                                        </button>
                                                        <button
                                                            className="btn-revoke"
                                                            onClick={() => openModal(user, 'revoke')}
                                                            disabled={user.accessStatus === 'revoked'}
                                                            title={user.accessStatus === 'revoked' ? 'Already revoked' : 'Revoke access'}
                                                        >
                                                            ✕ Revoke
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="dashboard-card">
                        <h2 className="card-title">📋 Access History (Audit Log)</h2>
                        {historyLoading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading history...</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="empty-state">
                                <p>No access changes recorded yet.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Action</th>
                                            <th>Performed By</th>
                                            <th>Reason</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map(log => (
                                            <tr key={log._id}>
                                                <td className="user-email">{log.userEmail}</td>
                                                <td>
                                                    <span className={`action-badge action-${log.action}`}>
                                                        {log.action === 'granted' ? '✓ Granted' : '✕ Revoked'}
                                                    </span>
                                                </td>
                                                <td>{log.performedByEmail}</td>
                                                <td style={{ color: '#94a3b8', fontStyle: log.reason ? 'normal' : 'italic', maxWidth: '200px' }}>
                                                    {log.reason || '—'}
                                                </td>
                                                <td className="timestamp">{formatDate(log.timestamp)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="modal-box">
                        <h3>
                            {modal.action === 'grant' ? '✅ Grant Access' : '🚫 Revoke Access'}
                        </h3>
                        <p className="modal-subtitle">
                            {modal.action === 'grant'
                                ? `Grant access to ${modal.email}? They will be able to login immediately.`
                                : `Revoke access from ${modal.email}? They will be unable to login.`}
                        </p>
                        <textarea
                            placeholder="Reason (optional)"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button
                                className={modal.action === 'grant' ? 'btn-confirm-grant' : 'btn-confirm-revoke'}
                                onClick={handleConfirm}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : modal.action === 'grant' ? 'Grant Access' : 'Revoke Access'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
