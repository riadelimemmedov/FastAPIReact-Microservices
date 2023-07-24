
//!React
import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'


//!Custom Components
import HeaderComponent from '../components/Header.jsx'
import SidebarComponent from '../components/Sidebar.jsx'
import BodyComponent from '../components/Body.jsx'



//!Third Party Package
import { Toaster,toast } from "react-hot-toast";


//*App
function App() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">

          {/* Header */}
          <HeaderComponent/>


          {/* Sidebar */}
          <SidebarComponent/>


          {/* Body */}
          <BodyComponent/>

        </div>
      </div>
      <Toaster/>
    </>
  )
}
export default App
