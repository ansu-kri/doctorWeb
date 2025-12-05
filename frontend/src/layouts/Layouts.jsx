import React from 'react'
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Routers from "../routes/routers.jsx";

const Layouts = () => {
  return (
   <>
   <Header/>
   <main>
    <Routers/>
   </main>
   <Footer/>
   </>
  )
}

export default Layouts
