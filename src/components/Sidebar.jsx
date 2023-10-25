import React from 'react'
import Navbar from './Navbar'
import Searchbar from './Searchbar'

function Sidebar() {
  return (
    <div className='sidebar'>
      <Navbar/>
      <Searchbar/>
    </div>
  )
}

export default Sidebar
