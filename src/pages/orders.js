import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { API } from "../utils/urls"

const fetchUserOrders = async (userEmail , token) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await fetch(`${API}/orders?user.email=${userEmail}`, options);
    const data = await res.json();
    console.log(data);
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return null;
  }
}

const Order = () => {
  const { data: session } = useSession();
  const [userOrders, setUserOrders] = useState([]);
  useEffect(() => {
    const fetchUserOrdersData = async () => {
      if (session) {
        const userEmail = session?.user?.email;
        const token = session.jwt;
        try {
          const orders = await fetchUserOrders( userEmail , token);
          const myorder =  orders.data;
          if (myorder && Array.isArray(myorder)) {
            setUserOrders(myorder);
            console.log(myorder);
          }
        } catch (error) {
          console.error('Error fetching user orders:', error);
        }
      }
    };

    fetchUserOrdersData();
  }, [session]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-4 text-center">My Orders</h1>
    {userOrders && userOrders.map((order) => (
      <div key={order.id} className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <span className="text-blue-700 font-semibold">Product Name:</span> {order.pname}
          </div>
          <div className="mb-4">
            <span className="text-blue-700 font-semibold">Order ID:</span> {order.id}
          </div>
          <div className="mb-4">
            <span className="text-blue-700 font-semibold">Total Amount:</span> {order.amount}
          </div>
          <div className="mb-4">
            <span className="text-blue-700 font-semibold">Product Quantity:</span> {order.quantity}
          </div>
          <div className="mb-4">
            <span className="text-blue-700 font-semibold">Product Size:</span> {order.selectedSize}
          </div>
          <div className="mb-4">
            <span className="text-blue-700 font-semibold">Order Date:</span> {order.createdAt}
          </div>
        </div>
      </div>
    ))}
  </div>
  

  
  );
};

export default Order;
