import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Chip,
} from '@mui/material';
import {
    AccountCircle,
    Contacts,
    Logout,
    Person,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    const isMenuOpen = Boolean(anchorEl);

    const profileMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            sx={{
                mt: 1,
                '& .MuiPaper-root': {
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                }
            }}
        >
            <MenuItem onClick={handleMenuClose} className="px-4 py-3">
                <Box className="flex items-center gap-3">
                    <Avatar sx={{ width: 32, height: 32 }}>
                        <Person />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="600">
                            {user?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user?.email}
                        </Typography>
                    </Box>
                </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout} className="px-4 py-3">
                <Box className="flex items-center gap-3 text-red-600">
                    <Logout fontSize="small" />
                    <Typography variant="body2">Sign Out</Typography>
                </Box>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
                }}
            >
                <Toolbar className="px-4 lg:px-8">
                    <Box className="flex items-center gap-2 flex-1">
                        <Box className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <Contacts className="text-white" fontSize="small" />
                        </Box>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            ContactHub
                        </Typography>
                    </Box>

                    {isAuthenticated && (
                        <Box className="flex items-center gap-4">
                            <Chip
                                avatar={<AccountCircle />}
                                label={`Welcome, ${user?.username}`}
                                variant="outlined"
                                sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '& .MuiChip-avatar': {
                                        color: 'primary.main',
                                    }
                                }}
                            />
                            <IconButton
                                edge="end"
                                aria-label="account"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                sx={{
                                    border: '2px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        bgcolor: 'primary.main',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {user?.username?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            {profileMenu}
        </>
    );
};

export default Header;
