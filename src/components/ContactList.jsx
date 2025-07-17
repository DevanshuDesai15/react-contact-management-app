import React, { useRef } from 'react';
import ContactCard from './ContactCard';
import { Link } from 'react-router-dom';
// Removed TypeScript types for now

const ContactList = ({ contacts, getContactId, searchKeyword, term }) => {
    console.log({ contacts, getContactId, searchKeyword, term }); 
    const inputEl = useRef(null);

    const deleteContactHandler = (id) => {
        getContactId(id);
    };

    const renderContactList = contacts.map((contact) => {
        return (
            <ContactCard contact={contact} clickHandler={deleteContactHandler} key={contact.id} />
        );
    });

    const getSearchTerm = () => {
        if (inputEl.current) {
            searchKeyword(inputEl.current.value);
        }
    };

    return (
        <div className='main'>
            <h2>Contact List 
                <Link to="/add">
                    <button className='ui primary button right floated'>Add Contact</button>
                </Link>
            </h2>
            <div className='ui search'>
                <div className='ui icon input'>
                    <input ref={inputEl} type="text" placeholder='Search Contact' className='prompt' value={term} onChange={getSearchTerm}/>
                    <i className='search icon'/>
                </div>
            </div>
            <div className='ui celled list'>
                {renderContactList.length > 0 ? renderContactList : "No Contacts available"}
            </div>
        </div>
    )
}
export default ContactList
