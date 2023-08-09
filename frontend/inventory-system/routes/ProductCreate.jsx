
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


//*BodyComponent
const ProductCreateComponent = () => {

    //state
    const [name, setName] = useState();
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();

    const [loading,setLoading] = useState(false)



    //navigate
    const navigate = useNavigate();
    const regex = /^[0-9]+$/;


    //createProduct
    const createProduct = async (e) => {
        e.preventDefault();
        setLoading(true)

        if(regex.test(name)){
            toast.error('Product must be exists word')
            setLoading(false)
            return 
        }
        else if(name != null && price > 0 && quantity > 0){
            setTimeout(async() => {
                await axios.post('http://127.0.0.1:4000/products',{
                    name: String(name),
                    price: Number(price),
                    quantity: Number(quantity)
                })
                .then((response) => {
                    if(response.data){
                        toast.success('Created product successfully')
                        setPrice('')
                        setQuantity('')
                        setName('')
                        setLoading(false)
                        setTimeout((e) => {
                            window.location.href='/'
                        }, 3000);
                    }
                })
                .catch((err) => {
                    toast.error('Please try again,occur some error at server')
                    setLoading(false)
                })
                }, 3000);
        }
        else{
            toast.error('Plese input minimum quantity which is must be greater than 0')
            setLoading(false)
        }
    }
    

    //returned jsx to client
    return(
        <>
            {/* Header */}
            <HeaderComponent/>


            {/* Sidebar */}
            <SidebarComponent/> 


            {/* Created Form */}
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <h1 className='text-center pb-2'>Create New Product</h1>
                <form className="mt-3" method="POST" onSubmit={createProduct}>
                    <div className='form-floating pb-3'>
                        <input type="text" className='form-control' value={name} onChange={(e)=>setName(e.target.value)}  placeholder='Name' required/>
                        <label>Name</label>
                    </div>
                    <div className='form-floating pb-3'>
                        <input type="number" className='form-control' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Price' required/>
                        <label>Price</label>

                    </div>
                    <div className='form-floating pb-3'>
                        <input type="number" className='form-control' value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder='Quantity' required/>
                        <label>Quantity</label>
                    </div>
                    <button className="btn btn-primary w-100 p-2" type='submit' disabled={loading || !name || !price}>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </main>
        </>
    )
}
export default ProductCreateComponent;