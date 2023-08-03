
//!React
import axios from 'axios';
import { useState,useEffect } from 'react'


//!React router
import {Link} from 'react-router-dom'


//!Third Party Package
import { Toaster } from 'react-hot-toast';



//*Header
const HeaderComponent = () => {

    //state
    const [isAuthenticated,setIsAuthenticated] = useState(false)
    const [userToken,setUserToken] = useState({
        token:'',
    })


    //hanleAuthentication
    const hanleAuthentication = (event) => {
        if(window.localStorage.getItem('token')){
            setUserToken({token:window.localStorage.getItem('token')})
            setIsAuthenticated(true)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('token')
            axios.get('http://127.0.0.1:5000/user/order')
                .then((response) => {
                    console.log('Response value is user order ', response.data)
                })
                .catch((err) => {
                    console.log('Not work properyly please try again ', err)
                })
        }
        else{
            setUserToken({token:''})
            setIsAuthenticated(false)
            axios.defaults.headers.common['Authorization'] = ''
        }
    }   



    //logoutUser
    const logoutUser = (event) => {
        axios.defaults.headers.common['Authorization'] = ''
        window.localStorage.removeItem('token')
        setUserToken({token:''})
        setIsAuthenticated(false)
        history.replace('/login')
    }


    //useEffect
    useEffect(() => {
        hanleAuthentication()
    },[])

    return (
        <>  
            <Toaster/>
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/">WareHouse Microservices</a>
                <div className="navbar-nav">
                        <div className="nav-item text-nowrap">
                            {
                                userToken.token != null && isAuthenticated.toString() == "true" ? (
                                    <>
                                        <Link to={'/'} className="nav-link px-3" style={{display:"inline"}} onClick={logoutUser}>LogOut</Link> ;
                                    </>

                                )
                                :
                                (
                                    <>
                                        <Link to={'/login'} className="nav-link px-3" style={{display:"inline"}}>Login</Link> ;
                                        <Link to={'/register'} className="nav-link px-3" style={{display:"inline"}}>Register</Link> ;
                                    </>
                                )
                            }
                            
                        </div>
                </div>
            </header>
        </>
    )
}
export default HeaderComponent


