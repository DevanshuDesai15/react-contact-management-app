import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="ui container" style={{ marginTop: '50px' }}>
                <div className="ui active centered inline loader"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;