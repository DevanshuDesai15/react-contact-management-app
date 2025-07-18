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
    Stack,
} from '@mui/material';
import {
    Person,
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    PersonAdd,
    Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

        if (!userData.username || !userData.email || !userData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (userData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        const result = await register(userData);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Registration failed');
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
                    <Box className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
                        <PersonAdd className="text-white text-2xl" />
                    </Box>
                    <Typography variant="h4" component="h1" fontWeight="700" className="mb-2">
                        Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Join ContactHub and manage your contacts with ease
                    </Typography>
                </Box>

                {/* Register Card */}
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

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    type="text"
                                    value={userData.username}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
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
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={userData.email}
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
                                    value={userData.password}
                                    onChange={handleChange}
                                    required
                                    helperText="Password must be at least 6 characters long"
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
                                    startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #d946ef 0%, #0ea5e9 100%)',
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #c026d3 0%, #0284c7 100%)',
                                        }
                                    }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </Stack>
                        </form>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?
                            </Typography>
                        </Divider>

                        <Button
                            component={Link}
                            to="/login"
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderColor: 'secondary.main',
                                color: 'secondary.main',
                                '&:hover': {
                                    borderColor: 'secondary.dark',
                                    backgroundColor: 'rgba(217, 70, 239, 0.04)',
                                }
                            }}
                        >
                            Sign In Instead
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

export default Register;