
//!React
import axios from 'axios';
import { useState,useEffect } from 'react'


//!React router
import {Link} from 'react-router-dom'


//!Third Party Package
import { Toaster } from 'react-hot-toast';

import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';



//*Header
const HeaderComponent = () => {

    //state
    const [isAuthenticated,setIsAuthenticated] = useState(false)
    const [userToken,setUserToken] = useState({
        token:'',
    })
    
    const [firstName,setFirstName] = useState()
    const [lastName,setLastName] = useState()
    const [cartItemCount,setcartItemCount] = useState()



    //hanleAuthentication
    const hanleAuthentication = async (event) => {
        if(window.localStorage.getItem('token')){
            setUserToken({token:window.localStorage.getItem('token')})
            setIsAuthenticated(true)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('token')
            await axios.get('http://127.0.0.1:5000/user/order')
                .then((response) => {
                    setFirstName(response.data.user.first_name)
                    setLastName(response.data.user.last_name)
                    window.localStorage.setItem("user_email",response.data.user.email)
                    window.localStorage.setItem('user_hashed_id',response.data.user.user_hashed_id)
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
        setuserHashedId()
        setIsAuthenticated(false)
        history.replace('/login')
    }



    //getFromCart
    const getFromCart = (e) => {
        let userHashedId = window.localStorage.getItem('user_hashed_id')
        if(userHashedId){
            setTimeout(async() => {
                await axios.post(`http://127.0.0.1:9000/get_from_cache/?user_hashed_id=${userHashedId}`)
                .then((response) => {
                    setcartItemCount(Number(response.data.cart_item_count))
                })
                .catch((err) => {
                    console.log('Error when get cache data from backend ', err)
                })
            }, 0);
        }
    }
    


    //useEffect
    useEffect(() => {
        hanleAuthentication()
        getFromCart()
    },[])


    
    //return jsx to client
    return (
        <>  
            <Toaster/>
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-3 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/" style={{backgroundColor:'#212529',border:'0',textDecoration:'none'}}>WareHouse Microservices</a>
                <div className="navbar-nav">
                        <div className="nav-item text-nowrap">
                            {
                                userToken.token != null && isAuthenticated.toString() == "true" ? (
                                    <>
                                        <Link to={'/'} className="nav-link px-3 text-light" style={{display:"inline"}} onClick={logoutUser}>LogOut</Link> ;
                                    
                                        <button type="button" className="btn btn-secondary position-relative" style={{marginRight:'10px'}}> 
                                            {`${firstName}  ${lastName}`}
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
                            <IconButton color="primary" aria-label="add to shopping cart">
                                <AddShoppingCartIcon />
                                <>
                                    <span className="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle" style={{padding:'8px',fontSize:'12px'}}>    
                                        {cartItemCount > 0 ?  cartItemCount  : 0}
                                    <span className="visually-hidden"></span>
                                    </span>
                                </>
                            </IconButton>
                        </div>
                </div>
            </header>
        </>
    )
}

export default HeaderComponent




