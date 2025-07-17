import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';
import { authAPI } from '../../api/contacts';
import { mockAuthResponse } from '../../test-utils';
import { render } from '../../test-utils';

// Mock the API
vi.mock('../../api/contacts', () => ({
    authAPI: {
        login: vi.fn(),
    },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderLogin = () => {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </MemoryRouter>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should render login form', () => {
        renderLogin();

        expect(screen.getByText('Log-in to your account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        expect(screen.getByText('New to us?')).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
        const user = userEvent.setup();
        authAPI.login.mockResolvedValue({ data: mockAuthResponse });

        renderLogin();

        // Fill in the form
        await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        // Should call API with correct credentials
        expect(authAPI.login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });

        // Should navigate to home page
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('should handle login failure', async () => {
        const user = userEvent.setup();
        authAPI.login.mockRejectedValue({
            response: { data: { error: 'Invalid credentials' } }
        });

        renderLogin();

        await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        // Should show error message
        await waitFor(() => {
            expect(screen.getByText('Login Failed')).toBeInTheDocument();
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });

        // Should not navigate
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
        const user = userEvent.setup();

        renderLogin();

        // Try to submit without filling fields
        await user.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
        });

        expect(authAPI.login).not.toHaveBeenCalled();
    });

    it('should show loading state during login', async () => {
        const user = userEvent.setup();
        // Mock a delayed response
        authAPI.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        renderLogin();

        await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        // Should show loading state
        expect(screen.getByRole('button', { name: 'Login' })).toHaveClass('loading');
        expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
    });

    it('should have accessible form elements', () => {
        renderLogin();

        const emailInput = screen.getByPlaceholderText('Email address');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toHaveAttribute('required');
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(passwordInput).toHaveAttribute('required');
        expect(loginButton).toHaveAttribute('type', 'submit');
    });

    it('should handle network errors', async () => {
        const user = userEvent.setup();
        authAPI.login.mockRejectedValue(new Error('Network Error'));

        renderLogin();

        await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(screen.getByText('Login Failed')).toBeInTheDocument();
            expect(screen.getByText('Login failed')).toBeInTheDocument();
        });
    });
}); 