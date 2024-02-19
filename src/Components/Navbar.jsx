import React, { useContext } from 'react'
import profile from '../images/profile.jpg'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../Context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)//the currentUser will be equal the user logged in specified in the AuthContext
  return (
    <div className='navbar'>
      <span className="logo">Chattie</span>
      <div className="user">
        <img src={currentUser.photoURL} />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar