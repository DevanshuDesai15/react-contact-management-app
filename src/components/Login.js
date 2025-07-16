import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!credentials.email || !credentials.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        const result = await login(credentials);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="ui container" style={{ marginTop: '50px' }}>
            <div className="ui middle aligned center aligned grid">
                <div className="column" style={{ maxWidth: '450px' }}>
                    <h2 className="ui teal image header">
                        <div className="content">
                            Log-in to your account
                        </div>
                    </h2>
                    <form className="ui large form" onSubmit={handleSubmit}>
                        <div className="ui stacked segment">
                            {error && (
                                <div className="ui error message">
                                    <div className="header">Login Failed</div>
                                    <p>{error}</p>
                                </div>
                            )}
                            
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="mail icon"></i>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={credentials.email}
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
                                        value={credentials.password}
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
                                Login
                            </button>
                        </div>
                    </form>
                    
                    <div className="ui message">
                        New to us? <Link to="/register">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;