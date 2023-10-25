import React from 'react'
// import Add from "../img"
function Register() {
  return (
 <div className="formContainer">
    <div className="formWrapper">
        <span className="logo">Chatapp</span>
        <span className="title">Register</span>
        <form >
            <input type='text' placeholder='Display name'/>
            <input type='email' placeholder='email'/>
            <input type='password' placeholder='password'/>
            <input style={{display:'none'}} type='file' id='file' placeholder='file'/>
            <label htmlFor="file">
            <img width="48" height="48" src="https://img.icons8.com/color/48/circled-user-male-skin-type-5--v1.png" alt="circled-user-male-skin-type-5--v1"/>
            <span>Add an Avatar</span>
            </label>
            <button>Sign up</button>
        </form>
        <p>You have an account ? login</p>
    </div>
 </div>
  )
}

export default Register
