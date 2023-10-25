import React from 'react'

function Navbar() {
  return (
    <div className='navbar'>
     <span className='logo'>ChatApp</span>

     <div className="user">
        <img src="https://images.pexels.com/photos/18843275/pexels-photo-18843275/free-photo-of-ella.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
        <span>John</span>
        <button>Logout</button>
     </div>
     
    </div>
  )
}

export default Navbar
