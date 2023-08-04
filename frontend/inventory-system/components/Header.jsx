
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
    
    const [firstName,setFirstName] = useState()
    const [lastName,setLastName] = useState()




    //hanleAuthentication
    const hanleAuthentication = (event) => {
        if(window.localStorage.getItem('token')){
            setUserToken({token:window.localStorage.getItem('token')})
            setIsAuthenticated(true)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('token')
            axios.get('http://127.0.0.1:5000/user/order')
                .then((response) => {
                    setFirstName(response.data.user.first_name)
                    setLastName(response.data.user.last_name)

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


    
    //return jsx to client
    return (
        <>  
            <Toaster/>
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-2 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/">WareHouse Microservices</a>
                <div className="navbar-nav">
                        <div className="nav-item text-nowrap">
                            {
                                userToken.token != null && isAuthenticated.toString() == "true" ? (
                                    <>
                                        <Link to={'/'} className="nav-link px-3 text-light" style={{display:"inline"}} onClick={logoutUser}>LogOut</Link> ;
                                    
                                        <button type="button" className="btn btn-secondary position-relative" style={{marginRight:'10px'}}> 
                                            {`${firstName}  ${lastName}`}
                                            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                                <span className="visually-hidden"></span>
                                            </span>
                                        </button>

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


