import React, { useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Avatar,
    Chip,
    Grid,
    Stack,
    Fab,
    Paper,
} from '@mui/material';
import {
    Search,
    Add,
    Person,
    Edit,
    Delete,
    Email,
    Phone,
    ContactsOutlined,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const ContactList = ({ contacts, getContactId, searchKeyword, term }) => {
    console.log({ contacts, getContactId, searchKeyword, term }); 
    const inputEl = useRef(null);
    const navigate = useNavigate();

    const deleteContactHandler = (id) => {
        getContactId(id);
    };

    const getSearchTerm = () => {
        if (inputEl.current) {
            searchKeyword(inputEl.current.value);
        }
    };

    const handleEditContact = (contact) => {
        navigate('/edit', { state: { contact } });
    };

    const handleViewContact = (contact) => {
        navigate(`/contact/${contact.id}`, { state: { contact } });
    };

    const getAvatarColor = (name) => {
        const colors = [
            '#f44336', '#e91e63', '#9c27b0', '#673ab7',
            '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
            '#009688', '#4caf50', '#8bc34a', '#cddc39',
            '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <Box className="space-y-6">
            {/* Header Section */}
            <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <Box>
                    <Typography variant="h4" component="h1" fontWeight="700" className="mb-2">
                        My Contacts
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and organize your contacts efficiently
                    </Typography>
                </Box>

                <Button
                    component={Link}
                    to="/add"
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    sx={{
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: 180,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #0284c7 0%, #c026d3 100%)',
                        }
                    }}
                >
                    Add New Contact
                </Button>
            </Box>

            {/* Search Section */}
            <Paper
                elevation={0}
                className="glass-effect p-6"
                sx={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Search contacts by name or email..."
                    value={term}
                    onChange={getSearchTerm}
                    inputRef={inputEl}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: 2,
                        }
                    }}
                />
            </Paper>

            {/* Stats Section */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="card-hover">
                    <CardContent className="flex items-center gap-4">
                        <Box className="p-3 bg-blue-100 rounded-xl">
                            <ContactsOutlined className="text-blue-600" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="600">
                                {contacts.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Contacts
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="flex items-center gap-4">
                        <Box className="p-3 bg-green-100 rounded-xl">
                            <Person className="text-green-600" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="600">
                                {term ? contacts.length : 'All'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {term ? 'Search Results' : 'Active Contacts'}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="flex items-center gap-4">
                        <Box className="p-3 bg-purple-100 rounded-xl">
                            <Search className="text-purple-600" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="600">
                                {term ? 'Filtered' : 'Ready'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Search Status
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Contacts Grid */}
            {contacts.length > 0 ? (
                <Grid container spacing={3}>
                    {contacts.map((contact) => (
                        <Grid item xs={12} sm={6} lg={4} key={contact.id}>
                            <Card
                                className="card-hover cursor-pointer h-full"
                                onClick={() => handleViewContact(contact)}
                                sx={{
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                    }
                                }}
                            >
                                <CardContent className="p-6">
                                    {/* Contact Header */}
                                    <Box className="flex items-center gap-3 mb-4">
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: getAvatarColor(contact.name),
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {contact.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box className="flex-1 min-w-0">
                                            <Typography
                                                variant="h6"
                                                fontWeight="600"
                                                className="truncate"
                                                sx={{ mb: 0.5 }}
                                            >
                                                {contact.name}
                                            </Typography>
                                            <Chip
                                                label="Contact"
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Contact Info */}
                                    <Box className="space-y-3 mb-4">
                                        <Box className="flex items-center gap-2">
                                            <Email fontSize="small" color="action" />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                className="truncate"
                                            >
                                                {contact.email}
                                            </Typography>
                                        </Box>
                                        {contact.phone && (
                                            <Box className="flex items-center gap-2">
                                                <Phone fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {contact.phone}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Action Buttons */}
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            size="small"
                                            startIcon={<Edit />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditContact(contact);
                                            }}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                color: 'primary.main',
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<Delete />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteContactHandler(contact.id);
                                            }}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                color: 'error.main',
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                /* Empty State */
                <Paper
                    elevation={0}
                    className="glass-effect"
                    sx={{
                        py: 8,
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Box className="max-w-md mx-auto">
                        <Box className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                            <ContactsOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="600" className="mb-2">
                            {term ? 'No contacts found' : 'No contacts yet'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" className="mb-6">
                            {term
                                ? `No contacts match "${term}". Try a different search term.`
                                : 'Start building your contact list by adding your first contact.'
                            }
                        </Typography>
                        {!term && (
                            <Button
                                component={Link}
                                to="/add"
                                variant="contained"
                                size="large"
                                startIcon={<Add />}
                                sx={{
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Add Your First Contact
                            </Button>
                        )}
                    </Box>
                </Paper>
            )}

            {/* Floating Action Button - Mobile */}
            <Fab
                component={Link}
                to="/add"
                color="primary"
                aria-label="add contact"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: { xs: 'flex', md: 'none' },
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #0284c7 0%, #c026d3 100%)',
                    }
                }}
            >
                <Add />
            </Fab>
        </Box>
    );
};

export default ContactList;
