
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


    //navigate
    const navigate = useNavigate();


    //createProduct
    const createProduct = async (e) => {
        e.preventDefault();
        if(name != null && price != null && quantity != null){
            await axios.post('http://127.0.0.1:4000/products',{
                name: String(name),
                price: Number(price),
                quantity: Number(quantity)
            })
            .then((response) => {
                if(response.data){
                    toast.success('Created product successfully')
                    setTimeout((e) => {
                        window.location.href='/'
                    }, 1500);
                }
            })
            .catch((err) => {
                toast.error('Please try again,occur some error at server')
            })
        }
        else{
            toast.error('Plese fill whole input field')
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
                        <input type="text" className='form-control' value={name} onChange={(e)=>setName(e.target.value)}  placeholder='Name'/>
                        <label>Name</label>
                    </div>
                    <div className='form-floating pb-3'>
                        <input type="number" className='form-control' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Price'/>
                        <label>Price</label>

                    </div>
                    <div className='form-floating pb-3'>
                        <input type="number" className='form-control' value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder='Quantity'/>
                        <label>Quantity</label>
                    </div>
                    <button className="btn btn-primary w-100 p-2" type='submit'>Create</button>
                </form>
            </main>
        </>
    )
}
export default ProductCreateComponent;