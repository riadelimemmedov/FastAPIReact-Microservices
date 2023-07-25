
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


    //getAllProducts
    const getAllProducts = async () => {
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

    
    //useEffect
    useEffect(() => {
        getAllProducts();
    },[])



    //return jsx data to client
    return(
        <>  
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <div className="pt-3 pb-2 mb-3 border-bottom">
                    <Link to={'/create'} className="btn btn-warning btn-sm fw-bold border-2">Add Product</Link> &nbsp;
                    <Link to={'/orders'} className="btn btn-secondary btn-sm fw-bold border-2">Orders</Link> &nbsp;
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
                                        <td>
                                            <a href="#" className="btn btn-danger btn-sm" onClick={(e) => deleteProduct(product.pk)}>
                                                Delete
                                            </a>
                                        </td>
                                        <td>
                                            <Link to={`/order/${product.pk}`} className="btn btn-primary btn-sm fw-bold border-2">Order</Link>
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