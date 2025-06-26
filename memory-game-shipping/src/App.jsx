import { useState } from 'react'
import viteLogo from '/vite.svg'
import ccLogo from './assets/cma.png'
import './App.css'

function MySociabble () {
  return(
    <div className="bg-ccblue py-12 px-6 text-center">
      <p className="font-ssp text-white text-xl md:text-3xl font-bold tracking-wide mb-8 max-w-4xl mx-auto leading-tight">
        WE IMAGINE BETTER WAYS TO SERVE A WORLD IN MOTION
      </p>
      <img src={ccLogo} alt="CMA CGM Logo" className="mx-auto h-16 md:h-20 filter brightness-0 invert"/>
    </div>
  )
}


function App() {

  return (
    <>
      <MySociabble/>
    </>
  )
}

export default App
