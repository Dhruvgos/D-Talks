import React from 'react'

function Searchbar() {
  return (
    <div className='search'>
        <div className="searchForm">
            <input placeholder='Enter user ' type="text" />
        
        </div>
      <div className="userChat">
        <img src="https://images.pexels.com/photos/18843275/pexels-photo-18843275/free-photo-of-ella.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
        <div className="userChatInfo">
            <span>Jane</span>
        </div>
      </div>
    </div>
  )
}

export default Searchbar
