import React from "react";
import { useState } from "react";

import './SignIn.css';
const SignIn = () =>{
    const [formData,setFormdata] = useState({
        email: '',
        password:''
    });
    const [loading,setLoading] = useState(false);

    const handleChange = (e) => {
        const {value } = e.target;
        switch (e.target.name) {
            case "email":
              setFormdata((prevData) => ({ ...prevData, email: value }));
              break;
            case "password":
              setFormdata((prevData) => ({ ...prevData, password: value }));
              break;
           default:
              console.warn("Unhandled field:", e.target.name);
          }
        
        
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const dataToSubmit = {...formData};
        try{
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSubmit),
              credentials:"include"
        });
        const result = await response.json();
        if(!response) {
            throw new Error('Failed to log in');
        }
        else {
            setTimeout(() => {
                setLoading(false);
              
              },3000)
        };
        console.log(result);
         }
         catch (error) {
            console.log(error);
            alert('Login failed')
         }

    }
    return (
        <div className="form">
            <form className="Sign_in_form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="inputs">
                    <input placeholder="Email or username*:" className="specialinput" name='email' onChange={handleChange} value = {formData.email}/>
                    <input placeholder="Password*: "  className="specialinput" name = 'password' onChange={handleChange} value = {formData.password}/>
                    <label><input type = "checkbox"   / >Remember me</label>
                </div>
                <button>Login</button>
                <p>Lost your password?</p>
            </form>
        </div>
        
    )
};
export default SignIn;

    
