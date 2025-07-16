import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.css';
import { v4 as uuid } from 'uuid';
import Header from './Header';
import AddContact from './AddContact'
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';
import api from "../api/contacts";
import EditContact from './EditContact';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';

// USED SEMENTIC UI FOR THIS APPLICATION

function App() {
  
  // const contacts=[
  //   {
  //     id: "1",
  //     "name": "Devanshu",
  //     "email": "devanshu@gmail.com"
  //   },
  //   {
  //     id: "2",
  //     "name": "Shreyan",
  //     "email": "shreyan@gmail.com"
  //   }
  // ]

  // NOW WITH THE USE OF HOOKS WE WILL GET THE CONTACTS
  const LOCAL_STORAGE_KEY="contacts"
  const [contacts, setContacts] = useState([]);
  const [SearchTerm, setSearchTerm] = useState("");
  const [SearchResults, setSearchResults] = useState([]);

  const addContactHandler = async (contact) => {
    console.log(contact);
    const response = await api.post("/contacts", contact)
    setContacts([...contacts, response.data]);
  };

  // UPDATE CONTACT
  const updateContactHandler = async (contact)=>{
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const {id, name, email} = response.data;
    setContacts(contacts.map(contact =>{
      return contact.id === id ? {...response.data} : contact;
    }))
  }

  // FOR DELETING THE ITEMS
  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });
    
    setContacts(newContactList);
  };

  // RETRIVE CONTACTS
  const retriveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  }

  // SEARCH
  const searchHandler = (SearchTerm)=>{
    //console.log(SearchTerm);
    setSearchTerm(SearchTerm);
    if(SearchTerm !== ""){
      const newContactList = contacts.filter((contact)=>{
        return Object.values(contact).join(" ").toLowerCase().includes(SearchTerm.toLowerCase())
      })
      setSearchResults(newContactList)
    }
    else{
      setSearchResults(contacts);
    }
  }

  // WE WILL USE HERE useEffect SO THAT WE CAN STORE THE DATA INSIDE THE LOCAL STORAGE DUE TO THAT DATA 
  // WE ADDED IN LIST WON'T DISAPPEAR 
  
  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts);
    const getAllContacts = async () => {
      const allContacts = await retriveContacts();
      if(allContacts) setContacts(allContacts);
    }
    getAllContacts();
}, [])
  
  // FOR STORING THE DATA
  useEffect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts))
  }, [contacts])
  
  return (
    <AuthProvider>
      <div className='ui container'>
        <Router>
          <Header />
          <div style={{ marginTop: '70px' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <ContactList 
                    contacts={SearchTerm.length < 1 ? contacts : SearchResults} 
                    getContactId={removeContactHandler} 
                    term={SearchTerm} 
                    searchKeyword={searchHandler}
                  />
                </ProtectedRoute>
              } />
              <Route path="/add" element={
                <ProtectedRoute>
                  <AddContact addContactHandler={addContactHandler}/>
                </ProtectedRoute>
              } />
              <Route path="/edit" element={
                <ProtectedRoute>
                  <EditContact updateContactHandler={updateContactHandler}/>
                </ProtectedRoute>
              } />
              <Route path="/contact/:id" element={
                <ProtectedRoute>
                  <ContactDetail/>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
