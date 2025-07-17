import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { authAPI } from '../../api/contacts';
import { mockUser, mockAuthResponse } from '../../test-utils';

// Mock the API
vi.mock('../../api/contacts', () => ({
    authAPI: {
        login: vi.fn(),
        register: vi.fn(),
    },
}));

// Test component to access auth context
const TestComponent = () => {
    const { user, login, register, logout, loading, isAuthenticated } = useAuth();

    return (
        <div>
            <div data-testid="loading">{loading ? 'loading' : 'not loading'}</div>
            <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
            <div data-testid="user">{user ? user.username : 'no user'}</div>
            <button onClick={() => login({ email: 'test@test.com', password: 'password' })}>
                Login
            </button>
            <button onClick={() => register({ username: 'test', email: 'test@test.com', password: 'password' })}>
                Register
            </button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should provide initial auth state', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('not authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });

    it('should handle successful login', async () => {
        const user = userEvent.setup();
        authAPI.login.mockResolvedValue({ data: mockAuthResponse });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await user.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
            expect(screen.getByTestId('user')).toHaveTextContent('testuser');
        });

        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    it('should handle login failure', async () => {
        const user = userEvent.setup();
        authAPI.login.mockRejectedValue({
            response: { data: { error: 'Invalid credentials' } }
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await user.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(screen.getByTestId('authenticated')).toHaveTextContent('not authenticated');
        });
    });

    it('should handle successful registration', async () => {
        const user = userEvent.setup();
        authAPI.register.mockResolvedValue({ data: mockAuthResponse });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await user.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
            expect(screen.getByTestId('user')).toHaveTextContent('testuser');
        });
    });

    it('should handle logout', async () => {
        const user = userEvent.setup();

        // Set initial authenticated state
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Should be authenticated initially
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');

        await user.click(screen.getByText('Logout'));

        expect(screen.getByTestId('authenticated')).toHaveTextContent('not authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it('should restore auth state from localStorage', () => {
        localStorage.getItem.mockImplementation((key) => {
            if (key === 'token') return 'mock-token';
            if (key === 'user') return JSON.stringify(mockUser);
            return null;
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });
}); 