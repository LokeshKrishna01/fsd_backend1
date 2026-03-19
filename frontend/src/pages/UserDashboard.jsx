import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import '../styles/Dashboard.css';

function UserDashboard() {
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await userAPI.getStatus();
                setStatusData(res.data.data);
            } catch (err) {
                const msg = err.response?.data?.message || 'Failed to fetch status.';
                setError(msg);
                // If access was revoked/pending mid-session, auto-logout
                if (err.response?.status === 403) {
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/login');
                    }, 3000);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getStatusCardClass = (status) => {
        if (status === 'active') return 'status-card active-card';
        if (status === 'revoked') return 'status-card revoked-card';
        return 'status-card pending-card';
    };

    const getStatusIcon = (status) => {
        if (status === 'active') return '✅';
        if (status === 'revoked') return '🚫';
        return '⏳';
    };

    const getStatusTitle = (status) => {
        if (status === 'active') return 'Access Active';
        if (status === 'revoked') return 'Access Revoked';
        return 'Access Pending';
    };

    const getStatusMessage = (status) => {
        if (status === 'active') return 'You have full access to the system. Everything is working correctly.';
        if (status === 'revoked') return 'Your access has been revoked by the administrator. Please contact the admin for assistance. You will be logged out shortly.';
        return 'Your account is awaiting admin approval. Please check back later or contact the administrator.';
    };

    return (
        <div className="dashboard-wrapper">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-brand">
                    <div className="brand-icon">🔐</div>
                    <h1>Access Manager</h1>
                    <span className="role-badge header-role-badge-user">User</span>
                </div>
                <div className="header-right">
                    <span className="header-user">Logged in as <span>{user.email}</span></span>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className="dashboard-main">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your access status...</p>
                    </div>
                ) : error ? (
                    <div className="status-card revoked-card">
                        <span className="status-icon">⚠️</span>
                        <h2>Session Error</h2>
                        <p>{error}</p>
                        <button className="btn-logout" onClick={handleLogout} style={{ marginTop: 16 }}>
                            Back to Login
                        </button>
                    </div>
                ) : statusData ? (
                    <div className={getStatusCardClass(statusData.accessStatus)}>
                        <span className="status-icon">{getStatusIcon(statusData.accessStatus)}</span>
                        <h2>{getStatusTitle(statusData.accessStatus)}</h2>
                        <p>{getStatusMessage(statusData.accessStatus)}</p>

                        <div className="user-info-grid">
                            <div className="user-info-row">
                                <span className="info-label">📧 Email</span>
                                <span className="info-value">{statusData.email}</span>
                            </div>
                            <div className="user-info-row">
                                <span className="info-label">👤 Role</span>
                                <span className="info-value">{statusData.role}</span>
                            </div>
                            <div className="user-info-row">
                                <span className="info-label">🔑 Access Status</span>
                                <span>
                                    {statusData.accessStatus === 'active' && (
                                        <span className="status-badge status-active">● Active</span>
                                    )}
                                    {statusData.accessStatus === 'revoked' && (
                                        <span className="status-badge status-revoked">● Revoked</span>
                                    )}
                                    {statusData.accessStatus === 'pending' && (
                                        <span className="status-badge status-pending">⏳ Pending</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
}

export default UserDashboard;
