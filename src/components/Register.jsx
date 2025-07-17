import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Removed TypeScript types for now

const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (userData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        const result = await register({
            username: userData.username,
            email: userData.email,
            password: userData.password
        });
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Registration failed');
        }
        
        setLoading(false);
    };

    return (
        <div className="ui container" style={{ marginTop: '50px' }}>
            <div className="ui middle aligned center aligned grid">
                <div className="column" style={{ maxWidth: '450px' }}>
                    <h2 className="ui teal image header">
                        <div className="content">
                            Create your account
                        </div>
                    </h2>
                    <form className="ui large form" onSubmit={handleSubmit}>
                        <div className="ui stacked segment">
                            {error && (
                                <div className="ui error message">
                                    <div className="header">Registration Failed</div>
                                    <p>{error}</p>
                                </div>
                            )}
                            
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="user icon"></i>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={userData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="mail icon"></i>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={userData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon"></i>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon"></i>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={userData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button 
                                className={`ui fluid large teal submit button ${loading ? 'loading' : ''}`}
                                type="submit"
                                disabled={loading}
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    
                    <div className="ui message">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;