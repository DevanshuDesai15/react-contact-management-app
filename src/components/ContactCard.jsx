import React from 'react';
import { Link } from 'react-router-dom';
import icon from '../images/icon.jpg';
// Removed TypeScript types for now

const ContactCard = ({ contact, clickHandler }) => {
    const { id, name, email } = contact;
    console.log(contact);
    
    return (
        <div className='item'>
            <img className='ui avatar image' src={icon} alt='icon'/>
            <div className='content'>
                <Link to={`/contact/${id}`} state={{ contact: contact }}>
                    <div className='header'>{name}</div>
                    <div>{email}</div>
                </Link>
            </div>
            <i className='trash alternate outline icon right floated' 
                style={{ color: "red", fontSize: "20px", marginLeft: "10px" }} 
                onClick={() => clickHandler(id)}
            >
            </i>
            <Link to={`/edit`} state={{ contact: contact }}>
                <i className='edit alternate outline icon right floated' 
                    style={{ color: "blue", fontSize: "20px" }} 
                >
                </i>
            </Link>
        </div>
    );
};

export default ContactCard
