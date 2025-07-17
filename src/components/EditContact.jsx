import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Removed TypeScript imports and interfaces

const EditContact = ({ updateContactHandler }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id, name, email } = location.state.contact;
    const [user, setUser] = useState({ id, name, email });
    
    const update = (e) => {
        e.preventDefault();
        if (user.name === "" || user.email === "") {
            alert("All fields are mandatory!!!");
            return;
        }
        // THIS IS USED TO SHOW THE LIST DATA ON THE APP.JS FILE 
        updateContactHandler(user);
        // Navigate back to the list
        navigate('/');
    };

    const handleNameChange = (e) => {
        setUser({ ...user, name: e.target.value });
    };

    const handleEmailChange = (e) => {
        setUser({ ...user, email: e.target.value });
    };
    
    return (
        <div className='ui main'>
            <h2>Edit Contact</h2>
            <form className='ui form' onSubmit={update}>
                <div className='field'>
                    <label>Name</label>
                    <input type="text" name="Name" placeholder='Name' value={user.name} onChange={handleNameChange}/>
                </div>
                <div className='field'>
                    <label>Email</label>
                    <input type="email" name="Email" placeholder='Email' value={user.email} onChange={handleEmailChange}/>
                </div>
                <button className='ui orange button'>Update</button>
            </form>
        </div>
    )
}

export default EditContact
