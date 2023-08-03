
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



//*SignupComponent
const SignupComponent = () => {

    
    //State value
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repassword: '',
        phone_number:'',
        first_name:'',
        last_name:'',
    });
    const [isActive,setIsActive] = useState(false)
    const [errors,setError] = useState([])

    

    //classes
    const classes = useStyles();



    //checkFormData
    const checkFormData = (register_form_obj,e) => {
        for(let key in register_form_obj){
            if(register_form_obj[key] == null){
                toast.error(`Please fill ${key} field`)
            }
        }
        if(register_form_obj['password'] != register_form_obj['repassword']){
            toast.error('Please match password input to password field')
        }
    }


    //handleErrors
    const handleErrors = (err_message) => {
        toast.error(String(err_message))
    }


    //handleRegisterSubmit
    const handleRegisterSubmit = async (event) => {
        event.preventDefault()
        try{
            if(formData){
                setIsActive(true)
                setTimeout(async() => {
                    await axios.post('http://127.0.0.1:2000/register/',{
                        email: formData.email,
                        password: formData.password,
                        phone_number: formData.phone_number,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                    })
                    .then((response) => {
                        if(response.data.token) window.location.href = '/login' 
                    })
                    .catch((err) => {
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
                    checkFormData(formData)
                    setIsActive(false)
                }, 5000);
            }
            else{
                handleErrors('Please check your credentials for registration process')
            }
        }
        catch(err){
            console.log('Not found formData ', err)
        }
    }


    //handleInputChange
    const handleInputChange = (key) => (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]:event.target.value
        }))
    }

    //handleDomEvent
    const handleDomEvent = () => {
        window.document.title = 'Register'
    }


    //useEffect
    useEffect(() => {
        handleDomEvent()
    },[])


    //return jsx to client
    return(
        <>
            {/* Header */}
            <HeaderComponent/>
            

            {/* Box */}
            <Box mt={5} style={{width:'50%',marginLeft:'auto',marginRight:'auto'}} sx={{boxShadow:5}}>
            <Card>
                <CardContent>
                    <form className={classes.root} onSubmit={handleRegisterSubmit}>
                        <h3>Register Form</h3>

                            <TextField
                                label="First Name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleInputChange('first_name')}
                                required
                            />
                            <TextField
                                label="Last Name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleInputChange('last_name')}
                                required
                            />
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
                            <TextField
                                label="Repassword"
                                type="password"
                                value={formData.repassword}
                                onChange={handleInputChange('repassword')}
                                required
                            />
                            <TextField
                                label="Phone"
                                type="text"
                                value={formData.phone_number}
                                onChange={handleInputChange('phone_number')}
                                required
                            />
                            <Button variant="contained" color="primary" type="submit" disabled={isActive}>
                                {isActive ? "Submitting..." : "Submit"}
                            </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
        {errors}
        </>
    )
}
export default SignupComponent