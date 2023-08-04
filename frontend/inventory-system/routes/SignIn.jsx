
//!React
import { useState,useEffect,Fragment } from 'react'


//!Custom Components
import HeaderComponent from '../components/Header.jsx'
import SidebarComponent from '../components/Sidebar.jsx'


//!React Router
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom';


//!Third Party Package
import { toast,Toaster } from 'react-hot-toast';
import axios from 'axios';


//!MateriUI React
import { Container,Grid,Card,Box,CardContent,TextField,Button } from '@material-ui/core'
import LoadingButton from '@mui/lab/LoadingButton'
import { shadows } from '@mui/system';


//!Custom styles
import useStyles from '../style/style.js'
import '../style/Pagination.css'



//*SignInComponent
const SignInComponent = () => {


    //state
    const [formData,setFormData] = useState({
        email:'',
        password:''
    })

    const [userCredentials,setUserToken] = useState({
        token:''
    })
    const [isActive,setIsActive] = useState(false)
    const [errors,setError] = useState([])


    //classes
    const classes = useStyles();


    //handleErrors
    const handleErrors = (err_message) => {
        toast.error(String(err_message))
    }

    
    //handleLoginSubmit
    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        if(formData.email != null && formData.password !== null){
            setIsActive(true)
            axios.defaults.headers.common['Authorization']=''
            window.localStorage.removeItem('token')
            
            setTimeout(async() => {
                await axios.post('http://127.0.0.1:2000/login/',{email:formData.email,password:formData.password})
                    .then((response) => {
                        setUserToken({token:response.data.token})
                        console.log('User credentials is ', response.data.user)
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
                        window.localStorage.setItem('token',response.data.token)
                        window.location.href = '/'
                    })
                    .catch((err)=>{
                        setError([])
                        if(Array.isArray(err.response.data.detail)){
                            for(const property in err.response.data.detail){
                                if(err.response.data.detail[property]['msg'] != undefined){
                                    handleErrors(err.response.data.detail[property]['msg'])
                                }
                            }
                        }
                        else{
                            handleErrors(err.response.data.detail)
                        }
                    })
                    setIsActive(false)
            }, 5000);
        }
        else{
            toast.error('Please input an email and password for login process') 
        }
    }


    //handleInputChange
    const handleInputChange = (key) => (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [key] : event.target.value
        }))
    }


    //handleDomEvent
    const handleDomEvent = () => {
        window.document.title = 'Login'
    }



    //isLoggedIn
    const isLoggedIn = () => {
        const token = window.localStorage.getItem('token') != null ? window.location.href = '/' : null
    }


    //useEffect
    useEffect(() => {
        handleDomEvent(),
        isLoggedIn()
    },[])



    //return jsx to client
    return (
        <>
            {/* Header */}
            <HeaderComponent/>


            {/* Box */}
            <Box mt={5} style={{width:'50%',marginLeft:'auto',marginRight:'auto'}} sx={{boxShadow:4}}>
                <Card>
                    <CardContent>
                        <form className={classes.root} onSubmit={handleLoginSubmit}>
                            <h3>Login Form</h3>
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                required
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                required
                            />
                            <Button variant="contained" color="primary" type="submit" disabled={isActive}>
                                {isActive ? 'Submitting...' : 'Submit'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
            {errors}
        </>
    )
}
export default SignInComponent