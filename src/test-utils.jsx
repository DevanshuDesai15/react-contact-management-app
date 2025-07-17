import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
    const { initialEntries = ['/'], ...renderOptions } = options;

    const Wrapper = ({ children }) => (
        <BrowserRouter>
            <AuthProvider>
                {children}
            </AuthProvider>
        </BrowserRouter>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock user for testing
export const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

// Mock contacts for testing
export const mockContacts = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        userId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        userId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Mock API responses
export const mockAuthResponse = {
    user: mockUser,
    token: 'mock-jwt-token',
    message: 'Login successful'
};

// Export everything
export * from '@testing-library/react';
export { renderWithProviders as render }; 