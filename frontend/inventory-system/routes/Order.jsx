
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


//*OrderComponent
const OrderComponent = () => {
    
    //state
    const [product_id,setProductId] = useState('')
    const [quantity,setQuantity] = useState()
    const [productQuantity,setProductQuantity] = useState()
    const [product,setProduct] = useState([])

    const [isDisable,setIsDisable] = useState(false)
    const [loading,setLoading] = useState(false)


    //getProductId
    const getProductId = () => {
        const product_id = window.location.href.split('/').pop()
        return product_id
    }


    //getProductDetail
    const getProductDetail = async() => {  
        // console.log('Product data response is this value ', response)
        const productId = getProductId()
        const response = (await axios.get(`http://127.0.0.1:4000/products/${productId}`)).data
        setIsDisable(response.name != null)
        setProduct(response)
        setProductId(productId)
        setProductQuantity(response.quantity)
        alert(`Product price is - ${parseFloat(response.price * 1.2)}  and  Quantity is - ${response.quantity} `)
    }


    //orderProduct
    const orderProduct = async (e) => {
        e.preventDefault();
        setLoading(true)

        if(quantity > productQuantity){
            toast.error(`You have limit quantity this product :${productQuantity}`)
            setLoading(false)
            return 
        }
        else if(product.name != null && quantity > 0){
            console.log('Producut is  is ', product_id)
            setTimeout(async() => {
                await axios.post('http://127.0.0.1:5000/orders',{
                    product_id:String(product_id),
                    customer_id: String(60),
                    quantity:Number(quantity),
                    price: 0,
                    fee: 0,
                    total: 0,
                    status: "",
                })
                .then((response) => {
                    if(response.data){
                        toast.success('We are accepting your order.Thanks for you selected our company.')
                        setQuantity('')
                        setLoading(false)
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    }
                })
                .catch((err) => {
                    console.log('Noldu sene  ', err)
                    toast.error('Please try again later')
                })
            }, 3000);
        }
        else{
            toast.error('Plese input minimum quantity which is must be greater than 0')
            setLoading(false)
        }
    }

    //useEffect
    useEffect(() => {
        getProductDetail()
    },[])



    //return jsx to client
    return(
        <>
            {/* Header */}
            <HeaderComponent/>


            {/* Sidebar */}
            <SidebarComponent/> 

            {/* Created Form */}
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <h1 className='text-center pb-2'>Order New Product</h1>
                <form className="mt-3" method="POST" onSubmit={orderProduct}>
                    
                    <div className='form-floating pb-3'>
                        <input type="text" className='form-control' value={product.name} placeholder='Name' disabled={isDisable}/>
                        <label>Name</label>
                    </div>
                    
                    <div className='form-floating pb-3'>
                        <input type="number" className='form-control' value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder='Quantity'/>
                        <label>Quantity</label>
                    </div>
                        <button className="btn btn-primary w-100 p-2" type='submit' disabled={loading || !product.name  || !quantity}>
                            {loading ? 'Ordered...' : 'Order'}
                        </button>
                    </form>
            </main>

        </>
    )
}
export default OrderComponent;