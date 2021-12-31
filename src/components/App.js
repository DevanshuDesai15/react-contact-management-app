import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Routes} from 'react-router-dom';
import './App.css';
import { v4 as uuid } from 'uuid';
import Header from './Header';
import AddContact from './AddContact'
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';
import api from "../api/contacts";
import EditContact from './EditContact';

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
    const request ={
      id : uuid(), 
      ...contact
    }
    const response = await api.post("/contacts", request)
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
    <div className='ui container'>
      <Router>
        <Header />
        <Routes>
        <Route path="/" 
        element={<ContactList contacts={SearchTerm.length < 1 ? contacts : SearchResults} getContactId={removeContactHandler} term={SearchTerm} searchKeyword={searchHandler}/>}
        //render={(props)=><ContactList contacts={contacts} getContactId={removeContactHandler} {...props} />}
        />
        <Route path="/add" 
        element={<AddContact addContactHandler={addContactHandler}/>}
        //render={(props)=><AddContact {...props} addContactHandler={addContactHandler}/>}
        />
        <Route path="/edit" 
        element={<EditContact updateContactHandler={updateContactHandler}/>}
        />
        <Route path="/contact/:id" element={<ContactDetail/>}/>
        </Routes>
        {/* <AddContact addContactHandler={addContactHandler}/> */}
        {/*Here in contact list props are used to get the values in the above contact array*/}
        {/* <ContactList contacts={contacts} getContactId={removeContactHandler}/> */}
      </Router>
    </div>
  );
}

export default App;
