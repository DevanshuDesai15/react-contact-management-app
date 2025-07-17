import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="ui fixed menu">
            <div className="ui container">
                <div className="header item">
                    <h2>Contact Manager</h2>
                </div>
                
                {isAuthenticated && (
                    <div className="right menu">
                        <div className="item">
                            <span>Welcome, {user?.username}!</span>
                        </div>
                        <div className="item">
                            <button 
                                className="ui button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
