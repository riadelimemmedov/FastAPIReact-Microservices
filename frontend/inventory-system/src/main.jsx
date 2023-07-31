
//!React
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './css/dashboard.css'


//!React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';


//!Custom Components
import OrderComponent from '../routes/Order.jsx'
import ProductCreateComponent from '../routes/ProductCreate.jsx'
import OrdersListComponent from '../routes/OrdersList.jsx'
import SignupComponent from '../routes/Signup.jsx'
import SignInComponent from '../routes/SignIn.jsx'


//?Render component to client site dynamically
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<App/>}/>
          <Route path="/create" element={<ProductCreateComponent/>}/>
          <Route path="/order/:order_id" element={<OrderComponent/>}/>
          <Route path="/orders/" element={<OrdersListComponent/>}/>
          <Route path="/register/" element={<SignupComponent/>}/>
          <Route path="/login/" element={<SignInComponent/>}/>
        </Routes>
    </BrowserRouter>
)
