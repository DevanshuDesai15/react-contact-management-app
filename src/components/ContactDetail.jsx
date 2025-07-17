import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import user from '../images/user.jpg';
// Removed TypeScript imports and syntax

const ContactDetail = () => {
    // HERE DUE TO NEW VERSION OF ROUTER useLocation IS USED AND 
    // FROM CONTACTCARD IN LINK IT TOOK STATE AND THEN IT IS PASSED HERE
    const location = useLocation();
    const { name, email } = location.state.contact;

    return (
        <div className='main'>
            <div className='ui center aligned card'>
                <div className='image'>
                    <img src={user} alt='user'></img>
                </div>
                <div className='content'>
                    <div className='header'>{name}</div>
                    <div className='description'>{email}</div>
                </div>
            </div>
            <Link to="/">
                <div className='center div'>
                    <button className='ui red button center aligned '>Contact List</button>
                </div>
            </Link>
        </div>
    )
}

export default ContactDetail
