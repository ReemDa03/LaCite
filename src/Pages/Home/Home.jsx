import React, { useState } from 'react'
import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreProducts from '../../Components/ExploreProducts/ExploreProducts'

const Home = () => {

   
  return (
    <div className='home'>
      <Header/>
      <ExploreProducts />
    </div>
  )
}

export default Home
