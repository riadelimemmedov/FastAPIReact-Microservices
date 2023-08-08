
//!React
import { useState,useEffect } from 'react'


//!React Router
import {Link} from 'react-router-dom'


//!Third Party Package
import { Toaster,toast } from "react-hot-toast";
import axios from 'axios'



//*BodyComponent
const BodyComponent = () => {
    
    //state
    const [products, setProducts] = useState([])
    const [isEmpty, setIsEmpty] = useState(false)
    const [isAuthenticated,setIsAuthenticated] = useState(false)
    const [userRole,setUserRole] = useState()
    const [userHashedId,setuserHashedId] = useState()
    const [isAddedCart,setIsAddedCart] = useState(false)

    


    //getAllProducts
    const getAllProducts = async () => {
        // axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('token')
        const response = await axios.get('http://127.0.0.1:4000/products')
        setProducts(Object.values(response.data))
        setIsEmpty(Object.values(response.data).length == 0)
    }


    //deleteProduct
    const deleteProduct = async (product_id) => {
        if(window.confirm('Are you sure you want to delete this product')){
            const response = await axios.delete(`http://127.0.0.1:4000/products/${product_id}`)
            toast.success(`${response.data.success}`)
            setProducts(products.filter((product) => product.pk !== product_id))
        }
    }



    //hanleAuthentication
    const handleCurrentUser = (event) => {
        if(window.localStorage.getItem('token')){
            setIsAuthenticated(true)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('token')
            axios.get('http://127.0.0.1:5000/user/order')
                .then((response) => {
                    setUserRole(response.data.user.user_role)
                    setuserHashedId(response.data.user.user_hashed_id)
                })
                .catch((err) => {
                    console.log('Not work properyly please try again handleCurrentUser ', err)
                })
        }
        else{
            setIsAuthenticated(false)
            axios.defaults.headers.common['Authorization'] = ''
        }
    }   


    const addToCart = (e) => {
        e.preventDefault()
        if(userHashedId){
            setTimeout(() => {
                axios.post(`http://127.0.0.1:9000/add_to_cache/?user_hashed_id=${userHashedId}`)
                .then((response) => {
                    toast.success('Added to cart successfully')
                    console.log('Added to cart ', response.data)
                })
                .catch((err) => {
                    console.log('Buneidd ', err)
                    toast.error('Please try again ')
                })
            }, 3000);
        }
    }
    
    //useEffect
    useEffect(() => {
        getAllProducts(),
        handleCurrentUser()
    },[])



    //return jsx data to client
    return(
        <>  
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <div className="pt-3 pb-2 mb-3 border-bottom">

                {
                    userRole === 'USER' && isAuthenticated ? (
                        <div>
                            <Link to={'/orders'} className="btn btn-secondary btn-sm fw-bold border-2">Orders</Link> &nbsp;
                        </div>
                    ) : userRole === 'ADMIN' && isAuthenticated ? (
                        <div>
                            <Link to={'/orders'} className="btn btn-secondary btn-sm fw-bold border-2">Orders</Link> &nbsp;
                            <Link to={'/create'} className="btn btn-warning btn-sm fw-bold border-2">Add Product</Link> &nbsp;
                        </div>
                    ) : isAuthenticated == false ? (
                        <div className='alert alert-danger'>
                            Please login or register in site : &nbsp; <Link className="fw-bold" to={'/login'} style={{textDecoration:'none'}}>Login</Link>
                        </div>
                    ):
                    (
                        <p></p>
                    )
                }


                </div>
                <hr/>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th scope="col">#Pk</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Created Date</th>
                                <th scope="col">Delete Product</th>
                                <th scope="col">Order Product</th>
                                <th scope="col">Add To Cart</th>
                            </tr>
                        </thead>
                        <tbody> 
                        {
                                products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.pk}</td>
                                        <td>{product.name}</td>
                                        <td>{parseFloat(product.price * 1.2)}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.created_date}</td>

                                        {
                                            userRole == 'ADMIN' && isAuthenticated  ? (
                                                <td>
                                                    <a href="#" className="btn btn-danger btn-sm" onClick={(e) => deleteProduct(product.pk)}>
                                                        Delete
                                                    </a>
                                                </td>
                                            )
                                            :(
                                                <td className='text-danger fw-bold'>Not Allowed</td>
                                            )
                                        }

                                        {
                                            isAuthenticated ? (
                                                <td>
                                                    <Link to={`/order/${product.pk}`} className="btn btn-primary btn-sm fw-bold border-2">Order</Link>
                                                </td>
                                            )
                                            : (
                                                <td className='text-secondary fw-bold'>You need to login</td>
                                            )
                                        }
                                        <td>
                                            <button className="btn btn-secondary btn-sm fw-bold border-2" onClick={addToCart}>
                                                Add to cart
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        }
                        {isEmpty ? (
                                <tr>
                                    <td colSpan="16" style={{boxShadow:'none',backgroundColor:'red !important'}}>
                                        <div className='alert alert-danger fw-bold text-secondary mt-2'>Not Found Product</div>
                                    </td>
                                </tr>
                            ):null
                        }
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}
export default BodyComponent;