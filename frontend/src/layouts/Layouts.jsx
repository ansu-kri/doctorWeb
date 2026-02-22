import React from 'react'
import Navbar from '../components/Header/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx';
import Routers from "../routes/routers.jsx";

const Layouts = () => {
  return (
   <>
   <Navbar/>
   <main>
    <Routers/>
   </main>
   <Footer/>
   </>
  )
}

export default Layouts
