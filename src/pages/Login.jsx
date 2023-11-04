import React from 'react'
import { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate,Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Register from './Register';
function Login() {

  const [err, setErr] = useState(false);
  const navigate  =  useNavigate();
  const handleSubmit = async (e) => {
   e.preventDefault();
   
   const email = e.target[0].value;
   const password = e.target[1].value;
    
 
   try {
 
   const usercred = await signInWithEmailAndPassword(auth,email,password);
   navigate('/')
   const user = usercred.user;
    // console.log(user);
   } catch (err) {
     setErr(true);
     
   }
 };

  return (
    <div className="formContainer">
    <div className="formWrapper">
        <span className="logo">D-
        <span style={{color:'rgb(79 197 207)'}}>T</span>
        alks</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit} >
            <input type='email' placeholder='email'/>
            <input type='password' placeholder='password'/>
            
            <button>Login</button>
        </form>
        
        <p>You don't have an account ? <Link to='/register'>Register</Link></p>
    </div>
 </div>
  )
}

export default Login
