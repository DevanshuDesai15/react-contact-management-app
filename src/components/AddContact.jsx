import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed TypeScript imports and interface

const AddContact = ({ addContactHandler }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "" });
    
    const add = (e) => {
        e.preventDefault();
        if (user.name === "" || user.email === "") {
            alert("All fields are mandatory!!!");
            return;
        }
        // THIS IS USED TO SHOW THE LIST DATA ON THE APP.JS FILE 
        addContactHandler(user);
        // THIS IS USED FOR WHEN THE ADD BUTTON IS PRESSED THE INPUT FILED AGAIN GETS EMPTY
        setUser({ name: "", email: "" });
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
            <h2>Add Contact</h2>
            <form className='ui form' onSubmit={add}>
                <div className='field'>
                    <label>Name</label>
                    <input type="text" name="Name" placeholder='Name' value={user.name} onChange={handleNameChange}/>
                </div>
                <div className='field'>
                    <label>Email</label>
                    <input type="email" name="Email" placeholder='Email' value={user.email} onChange={handleEmailChange}/>
                </div>
                <button className='ui secondary button'>Add</button>
            </form>
        </div>
    )
}

export default AddContact
