import React, { useState, useEffect } from 'react';
import './userAccount.css';
import Navbar from "../../components/navbar/Navbar"
import Footer from "../../components/footer/Footer"
import { useAuth } from '../../components/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserAccount = () => {
  const use_auth = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState({
    firstname: '',
    email: '',
    phone: '+123 456 7890',
  });
  const getUserDetails = async() => {
    const token = Cookies.get("authToken")
    const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-user-details`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(feedback)
  }


  useEffect(()=> {
    !use_auth?.user?.is_user_logged && navigate("/", {replace: true})
    getUserDetails()
  }, [])

  return (
    <div className='user-account-page-container'>
      <div className="container">
        <Navbar />
        <div className="row mt-5">
          {/* User Profile Section */}
          <div className="col-md-4 mt-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <img
                  src="data:image/jpeg;base64,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"
                  className="rounded-circle mb-3 img-fluid"
                  alt="User Profile"
                  style={{ border: '3px solid #6A0DAD' }}
                />
                <h3 className="card-title mb-0" style={{ color: '#6A0DAD' }}>{user.name}</h3>
                <p className="text-muted mb-4">{user.email}</p>
                {/* <button className="btn btn-outline-purple btn-block  mb-3">Edit Profile</button> */}
              </div>
            </div>
          </div>

          {/* Account Overview */}
          <div className="col-md-8 my-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body">
                <h4 style={{ color: '#6A0DAD' }}>Account Overview</h4>
                <hr />

                {/* Personal Information */}
                <div className="mb-4">
                  <h5 style={{ color: '#6A0DAD' }}>Personal Information</h5>
                  <p><strong>Full Name: </strong>{user.name}</p>
                  <p><strong>Email: </strong>{user.email}</p>
                  <p><strong>Phone: </strong>{user.phone}</p>
                  <button className="btn btn-outline-purple btn-sm">Update Information</button>
                </div>

                {/* Order History Section */}
                <div className="mb-4">
                  <h5 style={{ color: '#6A0DAD' }}>Order History</h5>
                  <div className="card p-3">
                    <div className="row">
                      <div className="d-flex align-items-center">
                        <div style={{width: "100%"}}><b>Order Id: 983637829</b><br />
                          <p className="text-muted">Date: 16 Dec 2024</p>
                        </div>
                          <p className="badge bg-warning">Pending...</p>
                      </div>
                      <hr />
                      <div className="col-md-4">
                        <p className="text-muted">
                          Contact <br />
                          John Doe <br />
                          Phone +23476453738378 <br />
                          Email: johndoe@gmail.com

                        </p>
                      </div>
                      <div className="col-md-4">
                        <p className="text-muted">
                          Shipping address <br />
                          600 Markley street, Suite 897383939, city, Dc, United States
                        </p>
                      </div>
                      <div className="col-md-4">
                        <p className="text-muted">
                          Payment <br />
                          Shipping fee USD 56 <br />
                          Total paid: USD 123,433
                        </p>
                      </div>
                      <hr />
                      <div className="col-lg-3 col-md-6 col-sm-6 col-6 ">
                        <div className="text-muted">
                          <img style={{width: "100%", height: "auto", maxWidth: "70px", maxHeight: "100px", objectFit: "contain"}} src="https://www.bundlesbynmeri.com/cdn/shop/files/069EC622-D344-40A0-9DE4-237406C3FCF4.jpg?v=1700781640&width=360" alt="" />
                        <div>
                          <small>Silky double drawn burmese hair 2-3 donors</small> <br />
                        <small>16"16"16</small><br />
                        <small>USD 7252</small> * 3
                        </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-6 col-6 ">
                        <div className="text-muted">
                          <img style={{width: "100%", height: "auto", maxWidth: "70px", maxHeight: "100px", objectFit: "contain"}} src="https://www.bundlesbynmeri.com/cdn/shop/files/069EC622-D344-40A0-9DE4-237406C3FCF4.jpg?v=1700781640&width=360" alt="" />
                        <div>
                          <small>Silky double drawn burmese hair 2-3 donors</small> <br />
                        <small>16"16"16</small><br />
                        <small>USD 7252</small> * 3
                        </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-6 col-6 ">
                        <div className="text-muted">
                          <img style={{width: "100%", height: "auto", maxWidth: "70px", maxHeight: "100px", objectFit: "contain"}} src="https://www.bundlesbynmeri.com/cdn/shop/files/069EC622-D344-40A0-9DE4-237406C3FCF4.jpg?v=1700781640&width=360" alt="" />
                        <div>
                          <small>Silky double drawn burmese hair 2-3 donors</small> <br />
                        <small>16"16"16</small><br />
                        <small>USD 7252</small> * 3
                        </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-6 col-6 ">
                        <div className="text-muted">
                          <img style={{width: "100%", height: "auto", maxWidth: "70px", maxHeight: "100px", objectFit: "contain"}} src="https://www.bundlesbynmeri.com/cdn/shop/files/069EC622-D344-40A0-9DE4-237406C3FCF4.jpg?v=1700781640&width=360" alt="" />
                        <div>
                          <small>Silky double drawn burmese hair 2-3 donors</small> <br />
                        <small>16"16"16</small><br />
                        <small>USD 7252</small> * 3
                        </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-6 col-6 ">
                        <div className="text-muted">
                          <img style={{width: "100%", height: "auto", maxWidth: "70px", maxHeight: "100px", objectFit: "contain"}} src="https://www.bundlesbynmeri.com/cdn/shop/files/069EC622-D344-40A0-9DE4-237406C3FCF4.jpg?v=1700781640&width=360" alt="" />
                        <div>
                          <small>Silky double drawn burmese hair 2-3 donors</small> <br />
                        <small>16"16"16</small><br />
                        <small>USD 7252</small> * 3
                        </div>
                        </div>
                      </div>
                      
                      

                    

                    </div>

                  </div>
                </div>

                {/* Account Settings Section */}
                <div>
                  <h5 style={{ color: '#6A0DAD' }}>Account Settings</h5>
                  <button className="btn btn-outline-purple btn-block">Change Password</button>
                  <button className="btn btn-outline-danger btn-block">Log Out</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
        <Footer />

    </div>

  );
};

export default UserAccount;







































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import "./userAccount.css"
// import Navbar from '../../components/navbar/Navbar'

// const UserAccount = () => {
// //   const [user, setUser] = useState(null);
// //   const [orders, setOrders] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const token = Cookies.get('authToken');

// //   // Fetch user data and order history on mount
// //   useEffect(() => {
// //     setIsLoading(true);

// //     axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/account`, {
// //       headers: {
// //         Authorization: `Bearer ${token}`
// //       }
// //     })
// //       .then(response => {
// //         setUser(response.data.user);
// //         setOrders(response.data.orders);
// //         setIsLoading(false);
// //       })
// //       .catch(err => {
// //         setError('Error loading account information');
// //         setIsLoading(false);
// //       });
// //   }, [token]);

// //   if (isLoading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (error) {
// //     return <div>{error}</div>;
// //   }

//   return <div>
//     <Navbar />
//     <div className="user-account-page-container">
//       <div className="account-page">
//         <h2>My Account</h2>
//         {/* {user && ( */}
//           <div className="account-details">
//             <section className="personal-info">
//               <h3>Personal Information</h3>
//               <p><strong>Name:</strong> john Doe</p>
//               <p><strong>Email:</strong> johndoe@gmail.com</p>
//               <p><strong>Phone:</strong> +54567899976677</p>
//               <Link to="/edit-profile">Edit Profile</Link>
//             </section>

//             <section className="order-history">
//               <h3>Order History</h3>
//               {/* {orders.length > 0 ? (
//                 <ul className="order-list">
//                   {orders.map((order) => (
//                     <li key={order.id}>
//                       <Link to={`/order/${order.id}`}>
//                         <div>Order #{order.orderNumber}</div>
//                         <div>{order.date}</div>
//                         <div>Total: {order.total} {order.currency}</div>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No orders found.</p>
//               )} */}
//                 <ul className="order-list">
//                 <li>
//                       <Link>
//                         <div>Order #7678787788</div>
//                         <div>24th of may 2024</div>
//                         <div>Total: 4000000 naira</div>
//                       </Link>
//                     </li>
//                 </ul>

//             </section>

//             <section className="address-book">
//               <h3>Address Book</h3>
//               {/* <p>{user.address ? `${user.address.street}, ${user.address.city}, ${user.address.zip}` : 'No address on file'}</p> */}
//               <p>user address</p>
//               <Link to="/manage-address">Manage Addresses</Link>
//             </section>
//           </div>
//         {/* )} */}
//       </div>
      
//     </div>
    
//   </div>
// };

// export default UserAccount;
