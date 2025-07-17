import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box className="min-h-screen flex items-center justify-center p-4">
            <Box className="w-full max-w-md">
                {/* Header */}
                <Box className="text-center mb-8">
                    <Box className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <LoginIcon className="text-white text-2xl" />
                    </Box>
                    <Typography variant="h4" component="h1" fontWeight="700" className="mb-2">
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Sign in to your account to continue
                    </Typography>
                </Box>

                {/* Login Card */}
                <Card
                    elevation={0}
                    className="glass-effect"
                    sx={{
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <CardContent className="p-8">
                        {error && (
                            <Alert
                                severity="error"
                                className="mb-6"
                                sx={{ borderRadius: 2 }}
                            >
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    }
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
                                    borderRadius: 2,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0284c7 0%, #c026d3 100%)',
                                    }
                                }}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                New to ContactHub?
                            </Typography>
                        </Divider>

                        <Button
                            component={Link}
                            to="/register"
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<PersonAdd />}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                    borderColor: 'primary.dark',
                                    backgroundColor: 'rgba(14, 165, 233, 0.04)',
                                }
                            }}
                        >
                            Create Account
                        </Button>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Box className="text-center mt-8">
                    <Typography variant="body2" color="text.secondary">
                        © 2024 ContactHub. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;