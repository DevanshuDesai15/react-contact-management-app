import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    InputAdornment,
    Stack,
    Alert,
    Paper,
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Save,
    ArrowBack,
    Edit,
} from '@mui/icons-material';

const EditContact = ({ updateContactHandler }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [contact, setContact] = useState({ name: "", email: "", phone: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (location.state?.contact) {
            const { name, email, phone = "", id } = location.state.contact;
            setContact({ name, email, phone, id });
        }
    }, [location.state]);

    const update = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        // Validation
        const newErrors = {};
        if (!contact.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!contact.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await updateContactHandler(contact);
            navigate('/');
        } catch (error) {
            setErrors({ submit: 'Failed to update contact. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field) => (e) => {
        setContact({ ...contact, [field]: e.target.value });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <Box className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <Box>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 3, textTransform: 'none' }}
                >
                    Back to Contacts
                </Button>

                <Box className="text-center mb-8">
                    <Box className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4">
                        <Edit className="text-white text-2xl" />
                    </Box>
                    <Typography variant="h4" component="h1" fontWeight="700" className="mb-2">
                        Edit Contact
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Update the contact information below
                    </Typography>
                </Box>
            </Box>

            {/* Form Card */}
            <Card
                elevation={0}
                className="glass-effect"
                sx={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <CardContent className="p-8">
                    {errors.submit && (
                        <Alert severity="error" className="mb-6" sx={{ borderRadius: 2 }}>
                            {errors.submit}
                        </Alert>
                    )}

                    <form onSubmit={update}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                placeholder="Enter contact's full name"
                                value={contact.name}
                                onChange={handleChange('name')}
                                error={!!errors.name}
                                helperText={errors.name}
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
                                type="email"
                                placeholder="Enter contact's email address"
                                value={contact.email}
                                onChange={handleChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
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
                                label="Phone Number"
                                type="tel"
                                placeholder="Enter contact's phone number (optional)"
                                value={contact.phone}
                                onChange={handleChange('phone')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    }
                                }}
                            />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    size="large"
                                    onClick={handleBack}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        flex: 1,
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? null : <Save />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        flex: 1,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
                                        }
                                    }}
                                >
                                    {isSubmitting ? 'Updating Contact...' : 'Update Contact'}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </CardContent>
            </Card>

            {/* Current Contact Info */}
            <Paper
                elevation={0}
                className="glass-effect p-6"
                sx={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <Typography variant="h6" fontWeight="600" className="mb-3">
                    📝 Editing Contact
                </Typography>
                <Box className="space-y-2">
                    <Typography variant="body2" color="text.secondary">
                        Original Name: <strong>{location.state?.contact?.name}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Original Email: <strong>{location.state?.contact?.email}</strong>
                    </Typography>
                    {location.state?.contact?.phone && (
                        <Typography variant="body2" color="text.secondary">
                            Original Phone: <strong>{location.state?.contact?.phone}</strong>
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default EditContact;
