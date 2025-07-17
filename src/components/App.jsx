import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import AddContact from './AddContact'
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';
import api from "../api/contacts";
import EditContact from './EditContact';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const addContactHandler = async (contact) => {
    console.log(contact);
    const response = await api.post("/contacts", contact);
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    setContacts(contacts.map(existingContact =>
      existingContact.id === contact.id ? response.data : existingContact
    ));
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => contact.id !== id);
    setContacts(newContactList);
  };

  const retrieveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      const getAllContacts = async () => {
        try {
          const allContacts = await retrieveContacts();
          if (allContacts) setContacts(allContacts);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      };
      getAllContacts();
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  return (
    <Box className="min-h-screen gradient-bg">
      <Router>
        <Header />
        <Container maxWidth="lg" className="pt-24 pb-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <ContactList
                  contacts={searchTerm.length < 1 ? contacts : searchResults}
                  getContactId={removeContactHandler}
                  term={searchTerm}
                  searchKeyword={searchHandler}
                />
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <AddContact addContactHandler={addContactHandler} />
              </ProtectedRoute>
            } />
            <Route path="/edit" element={
              <ProtectedRoute>
                <EditContact updateContactHandler={updateContactHandler} />
              </ProtectedRoute>
            } />
            <Route path="/contact/:id" element={
              <ProtectedRoute>
                <ContactDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Router>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;