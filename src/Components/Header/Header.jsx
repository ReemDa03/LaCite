import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Unlock the trends. Shop now!</h2>
        <p>Discover abayas, shoes, and jewelry crafted for elegance. Your go-to fashion hub for timeless style and grace.</p>
        <Link to='/#explore-product'><button className='hide'>View Products</button></Link>
      </div>
    </div>
  )
}

export default Header
