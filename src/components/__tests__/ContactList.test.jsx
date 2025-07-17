import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ContactList from '../ContactList';
import { mockContacts } from '../../test-utils';
import { render } from '../../test-utils';

const defaultProps = {
    contacts: mockContacts,
    getContactId: vi.fn(),
    searchKeyword: vi.fn(),
    term: '',
};

const renderContactList = (props = {}) => {
    return render(
        <MemoryRouter>
            <ContactList {...defaultProps} {...props} />
        </MemoryRouter>
    );
};

describe('ContactList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render contact list with contacts', () => {
        renderContactList();

        expect(screen.getByText('Contact List')).toBeInTheDocument();
        expect(screen.getByText('Add Contact')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search Contact')).toBeInTheDocument();

        // Should render contact cards
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should render empty state when no contacts', () => {
        renderContactList({ contacts: [] });

        expect(screen.getByText('Contact List')).toBeInTheDocument();
        expect(screen.getByText('No Contacts available')).toBeInTheDocument();
    });

    it('should handle search input', async () => {
        const user = userEvent.setup();
        const mockSearchKeyword = vi.fn();

        renderContactList({ searchKeyword: mockSearchKeyword });

        const searchInput = screen.getByPlaceholderText('Search Contact');
        await user.type(searchInput, 'John');

        expect(mockSearchKeyword).toHaveBeenCalledWith('John');
    });

    it('should display search term in input', () => {
        renderContactList({ term: 'John' });

        const searchInput = screen.getByPlaceholderText('Search Contact');
        expect(searchInput).toHaveValue('John');
    });

    it('should handle contact deletion', () => {
        const mockGetContactId = vi.fn();
        renderContactList({ getContactId: mockGetContactId });

        // Find and click delete button for first contact
        const deleteButtons = screen.getAllByText('');
        const firstDeleteButton = deleteButtons.find(button =>
            button.classList.contains('trash')
        );

        if (firstDeleteButton) {
            fireEvent.click(firstDeleteButton);
            expect(mockGetContactId).toHaveBeenCalledWith('1');
        }
    });

    it('should have link to add contact page', () => {
        renderContactList();

        const addContactButton = screen.getByText('Add Contact');
        expect(addContactButton.closest('a')).toHaveAttribute('href', '/add');
    });

    it('should render contact cards with proper links', () => {
        renderContactList();

        // Check if contact names are links to detail pages
        const johnDoeLink = screen.getByText('John Doe').closest('a');
        const janeSmithLink = screen.getByText('Jane Smith').closest('a');

        expect(johnDoeLink).toHaveAttribute('href', '/contact/1');
        expect(janeSmithLink).toHaveAttribute('href', '/contact/2');
    });

    it('should handle search input changes correctly', async () => {
        const user = userEvent.setup();
        const mockSearchKeyword = vi.fn();

        renderContactList({ searchKeyword: mockSearchKeyword, term: '' });

        const searchInput = screen.getByPlaceholderText('Search Contact');

        await user.clear(searchInput);
        await user.type(searchInput, 'test search');

        expect(mockSearchKeyword).toHaveBeenLastCalledWith('test search');
    });

    it('should display filtered contacts correctly', () => {
        const filteredContacts = [mockContacts[0]]; // Only John Doe
        renderContactList({ contacts: filteredContacts, term: 'John' });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

        const searchInput = screen.getByPlaceholderText('Search Contact');
        expect(searchInput).toHaveValue('John');
    });

    it('should have proper accessibility attributes', () => {
        renderContactList();

        const searchInput = screen.getByPlaceholderText('Search Contact');
        expect(searchInput).toHaveAttribute('type', 'text');

        const addButton = screen.getByText('Add Contact');
        expect(addButton).toHaveClass('ui', 'primary', 'button');
    });
}); 