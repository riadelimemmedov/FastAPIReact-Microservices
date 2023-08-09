
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
import ReactPaginate from 'react-paginate';
import axios from 'axios';


//!Custom styles
import '../style/Pagination.css'


//*OrdersListComponent
const OrdersListComponent = () => {

    //state
    const [orders,setOrders] = useState([])
    const [isEmpty,setIsEmpty] = useState(false)
    const [loading,setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);


    //pagination
    let itemsPerPage = 10
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = orders.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(orders.length / itemsPerPage);



    //getAllOrders
    const getAllOrders = async() => {
        axios.get('http://127.0.0.1:5000/user/order')
        .then((response) => {
            setOrders(Object.values(response.data.orders))
            setIsEmpty(Object.values(response.data.orders).length == 0)
        })
        .catch((err) => {
            toast.error('Please try again later')
        })
    }


    //cancelOrder 
    const cancelOrder = async (e) => {
        e.preventDefault()
        setLoading(true)
        if(confirm('Are you sure you want to cancel ordered product?')){
            const order_id = e.target.parentElement.parentElement.children[1].textContent
            await axios.patch(`http://127.0.0.1:5000/orders/cancel/${order_id}`)
                .then((response) => {
                    toast.success('Selected order cancelled successfully')
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                })
                .catch((err) => {
                    toast.error('Please try again,occur some problem when cancel order.')
                })
        }
    }


    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % orders.length;
        setItemOffset(newOffset);
    };

    
    //useEffect
    useEffect(() => {
        getAllOrders()
    },[])


    //return jsx to client
    return (
        <>
            {/* Header */}
            <HeaderComponent/>


            {/* Orders List Component */}
            <div className="container"> 
                <div className='row'>
                    <table className="table table-hover mt-5">
                        
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Order Id</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Fee</th>
                                <th scope="col">Total</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Ordered Date</th>
                                <th scope="col">Status</th>                                
                            </tr>
                        </thead>

                        <tbody>
                            {
                                currentItems.map((order,index) => (
                                    <tr key={index}>
                                        <td className='fw-bold text-secondary'>{currentItems.length == 10  ? index+1 : (orders.length - currentItems.length) + index+1})</td>
                                        <td>{order.pk}</td>
                                        <td>{order.product_name}</td>
                                        <td>{order.price}</td>
                                        <td>{order.fee.toFixed(2)}</td>
                                        <td>{order.total.toFixed(2)}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.created_date}</td>
                                        <td>
                                            {
                                                order.status === 'pending' ? (
                                                    <button className='btn btn-sm btn-danger' onClick={cancelOrder}>Cancel</button>
                                                ) : order.status === 'refunded' ? (
                                                    <button className='btn btn-sm btn-warning disabled'>Refunded</button>
                                                ) : (
                                                    <button className='btn btn-sm btn-success disabled'>Completed</button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                            {
                                isEmpty ? (
                                    <tr>
                                        <td colSpan="16" style={{boxShadow:'none',backgroundColor:'red !important'}}>
                                            <div className='alert alert-danger fw-bold text-secondary mt-2'>You have not order yet</div>
                                        </td>
                                    </tr>
                                ):null
                            }
                        </tbody>
                        <ReactPaginate
                            pageCount={pageCount} 
                            pageRangeDisplayed={5} 
                            marginPagesDisplayed={2} 
                            onPageChange={handlePageClick} 
                            containerClassName={'pagination'} 
                            activeClassName={'active'} 
                            disabled={true}
                        />
                </table>
                </div>
            </div>
            
        </>
    )
}
export default OrdersListComponent 