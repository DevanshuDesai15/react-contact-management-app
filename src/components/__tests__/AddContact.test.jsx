import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AddContact from '../AddContact';
import { render } from '../../test-utils';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const defaultProps = {
    addContactHandler: vi.fn(),
};

const renderAddContact = (props = {}) => {
    return render(
        <MemoryRouter>
            <AddContact {...defaultProps} {...props} />
        </MemoryRouter>
    );
};

describe('AddContact Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock window.alert
        global.alert = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should render add contact form', () => {
        renderAddContact();

        expect(screen.getByText('Add Contact')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should handle successful contact creation', async () => {
        const user = userEvent.setup();
        const mockAddContactHandler = vi.fn();

        renderAddContact({ addContactHandler: mockAddContactHandler });

        // Fill in the form
        await user.type(screen.getByLabelText('Name'), 'John Doe');
        await user.type(screen.getByLabelText('Email'), 'john@example.com');
        await user.click(screen.getByRole('button', { name: 'Add' }));

        // Should call handler with correct data
        expect(mockAddContactHandler).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com'
        });

        // Should navigate back to home
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should validate required fields', async () => {
        const user = userEvent.setup();
        const mockAddContactHandler = vi.fn();

        renderAddContact({ addContactHandler: mockAddContactHandler });

        // Try to submit without filling fields
        await user.click(screen.getByRole('button', { name: 'Add' }));

        // Should show alert and not call handler
        expect(global.alert).toHaveBeenCalledWith('All fields are mandatory!!!');
        expect(mockAddContactHandler).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should validate partial field completion', async () => {
        const user = userEvent.setup();
        const mockAddContactHandler = vi.fn();

        renderAddContact({ addContactHandler: mockAddContactHandler });

        // Fill only name field
        await user.type(screen.getByLabelText('Name'), 'John Doe');
        await user.click(screen.getByRole('button', { name: 'Add' }));

        // Should show alert and not call handler
        expect(global.alert).toHaveBeenCalledWith('All fields are mandatory!!!');
        expect(mockAddContactHandler).not.toHaveBeenCalled();
    });

    it('should clear form after successful submission', async () => {
        const user = userEvent.setup();
        const mockAddContactHandler = vi.fn();

        renderAddContact({ addContactHandler: mockAddContactHandler });

        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');

        // Fill in the form
        await user.type(nameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.click(screen.getByRole('button', { name: 'Add' }));

        // Form should be cleared
        expect(nameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
    });

    it('should handle form input changes', async () => {
        const user = userEvent.setup();
        renderAddContact();

        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');

        await user.type(nameInput, 'Test Name');
        await user.type(emailInput, 'test@email.com');

        expect(nameInput).toHaveValue('Test Name');
        expect(emailInput).toHaveValue('test@email.com');
    });

    it('should have proper form attributes', () => {
        renderAddContact();

        const form = screen.getByRole('button', { name: 'Add' }).closest('form');
        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');

        expect(form).toHaveClass('ui', 'form');
        expect(nameInput).toHaveAttribute('type', 'text');
        expect(nameInput).toHaveAttribute('placeholder', 'Name');
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toHaveAttribute('placeholder', 'Email');
    });

    it('should handle form submission via enter key', async () => {
        const user = userEvent.setup();
        const mockAddContactHandler = vi.fn();

        renderAddContact({ addContactHandler: mockAddContactHandler });

        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');

        await user.type(nameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.keyboard('{Enter}');

        expect(mockAddContactHandler).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com'
        });
    });

    it('should validate email format', async () => {
        const user = userEvent.setup();
        renderAddContact();

        const emailInput = screen.getByLabelText('Email');

        // The email input should have type="email" for browser validation
        expect(emailInput).toHaveAttribute('type', 'email');

        // Test with invalid email format
        await user.type(emailInput, 'invalid-email');
        expect(emailInput).toHaveValue('invalid-email');
    });
}); 