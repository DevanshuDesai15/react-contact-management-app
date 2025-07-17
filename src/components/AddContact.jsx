import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    IconButton,
    Paper,
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Save,
    ArrowBack,
    ContactPage,
} from '@mui/icons-material';

const AddContact = ({ addContactHandler }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", phone: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const add = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        // Validation
        const newErrors = {};
        if (!user.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!user.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await addContactHandler(user);
            setUser({ name: "", email: "", phone: "" });
            navigate('/');
        } catch (error) {
            setErrors({ submit: 'Failed to add contact. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field) => (e) => {
        setUser({ ...user, [field]: e.target.value });
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
                    <Box className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
                        <ContactPage className="text-white text-2xl" />
                    </Box>
                    <Typography variant="h4" component="h1" fontWeight="700" className="mb-2">
                        Add New Contact
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Fill in the details below to add a new contact to your list
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

                    <form onSubmit={add}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                placeholder="Enter contact's full name"
                                value={user.name}
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
                                value={user.email}
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
                                value={user.phone}
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
                                        background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        flex: 1,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                                        }
                                    }}
                                >
                                    {isSubmitting ? 'Adding Contact...' : 'Add Contact'}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </CardContent>
            </Card>

            {/* Tips Card */}
            <Paper
                elevation={0}
                className="glass-effect p-6"
                sx={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <Typography variant="h6" fontWeight="600" className="mb-3">
                    💡 Tips for Adding Contacts
                </Typography>
                <Box className="space-y-2">
                    <Typography variant="body2" color="text.secondary">
                        • Use the full name for easier searching
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • Double-check the email address for accuracy
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • Phone number is optional but helpful for quick contact
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddContact;
