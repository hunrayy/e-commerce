




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./userAccount.css"

const UserAccount = () => {
//   const [user, setUser] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const token = Cookies.get('authToken');

//   // Fetch user data and order history on mount
//   useEffect(() => {
//     setIsLoading(true);

//     axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/account`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(response => {
//         setUser(response.data.user);
//         setOrders(response.data.orders);
//         setIsLoading(false);
//       })
//       .catch(err => {
//         setError('Error loading account information');
//         setIsLoading(false);
//       });
//   }, [token]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

  return (
    <div className="account-page">
      <h2>My Account</h2>
      {/* {user && ( */}
        <div className="account-details">
          <section className="personal-info">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> john Doe</p>
            <p><strong>Email:</strong> johndoe@gmail.com</p>
            <p><strong>Phone:</strong> +54567899976677</p>
            <Link to="/edit-profile">Edit Profile</Link>
          </section>

          <section className="order-history">
            <h3>Order History</h3>
            {/* {orders.length > 0 ? (
              <ul className="order-list">
                {orders.map((order) => (
                  <li key={order.id}>
                    <Link to={`/order/${order.id}`}>
                      <div>Order #{order.orderNumber}</div>
                      <div>{order.date}</div>
                      <div>Total: {order.total} {order.currency}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found.</p>
            )} */}
              <ul className="order-list">
              <li>
                    <Link>
                      <div>Order #7678787788</div>
                      <div>24th of may 2024</div>
                      <div>Total: 4000000 naira</div>
                    </Link>
                  </li>
              </ul>

          </section>

          <section className="address-book">
            <h3>Address Book</h3>
            {/* <p>{user.address ? `${user.address.street}, ${user.address.city}, ${user.address.zip}` : 'No address on file'}</p> */}
            <p>user address</p>
            <Link to="/manage-address">Manage Addresses</Link>
          </section>
        </div>
      {/* )} */}
    </div>
  );
};

export default UserAccount;
