//!React
import { useState,useEffect } from 'react'



//*SidebarComponent
const SidebarComponent = () => {
    return(
        <>  
            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div className="position-sticky pt-3 sidebar-sticky">    
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link text-black fw-bold h2" aria-current="page" href="/">
                                Products
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}
export default SidebarComponent;






















