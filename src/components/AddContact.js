import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';
// HERE ABOVE useHistory IS REPLACED WITH useNavigate 

function AddContact(props) {
    
    const navigate=useNavigate();
    const [User, setUser] = useState({name:"", email:""});
    
    let add = (e) => {
        e.preventDefault();
        if(User.name === "" || User.email === ""){
            alert("All fields are mandatory!!!");
            return
        }
        // THIS IS USED TO SHOW THE LIST DATA ON THE APP.JS FILE 
        props.addContactHandler(User);
        // THIS IS USED FOR WHEN THE ADD BUTTON IS PRESSED THE INPUT FILED AGAIN GETS EMPTY
        setUser({name:"", email:""});
        //console.log(props);
        navigate('/');
    }
    
    return (
        <div className='ui main'>
            <h2>Add Contact</h2>
            <form className='ui form' onSubmit={add}>
                <div className='field'>
                    <label>Name</label>
                    <input type="text" name="Name" placeholder='Name' value={User.name} onChange={e => setUser({...User, name: e.target.value})}/>
                </div>
                <div className='field'>
                    <label>Email</label>
                    <input type="text" name="Email" placeholder='Email' value={User.email} onChange={e => setUser({...User, email: e.target.value})}/>
                </div>
                <button className='ui secondary button'>Add</button>
            </form>
        </div>
    )
}

export default AddContact
