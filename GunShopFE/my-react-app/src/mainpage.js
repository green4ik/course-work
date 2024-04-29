import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './styles.css';
import User from './images/user.png';
import CartImage from './images/shopping-cart.png'   ;
import Guns from './images/guns.png';
import {useState, useEffect} from 'react';
import { ProductCard } from './ProductCard';
import { Register } from './register';
import { Link, useNavigate  } from 'react-router-dom';
import { wait } from '@testing-library/user-event/dist/utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from './Cart';
import Orders from './Orders';
import OrderImage from './images/order.png';
export function MainPage() {
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  }
  const [showOrders, setShowOrders] = useState(false);
  const handleShowOrders = () => {
    setShowOrders(!showOrders);
  }
  const [orderData, setOrderData] = useState('');
  const [orderDetailsData,setOrderDetailsData] = useState('');
  const [cartData, setCartData] = useState('');
  const [productData, setProductData] = useState('');
  const [categoryData, setCategoryData] = useState('');
  const [productCategoryData, setProductCategoryData] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const savedData = localStorage.getItem('user-info');
  
  useEffect(() => {
      if (savedData) {
          const userData = JSON.parse(savedData); 
          setData(userData);
          getOrders();
          getOrderDetails();
          getCarts();
      }
  }, [loading2,loading,loading3]);
  
  useEffect(() => {
      if (!productData) {
          fetchData();
      }
  }, []);
  
  const fetchData = async () => {
      try {
          let response = await fetch("https://localhost:7183/api/Product/Get", {
              method: 'GET',
              headers: {
                  "Content-Type": 'application/json',
                  "Accept": 'application/json'
              }
          });
          if (!response.ok) {
              throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          setProductData(data);
      } catch (error) {
          console.error('Error fetching product data:', error);
      }
  
      try {
          let response = await fetch("https://localhost:7183/api/Product/GetCategory", {
              method: 'GET',
              headers: {
                  "Content-Type": 'application/json',
                  "Accept": 'application/json'
              }
          });
          if (!response.ok) {
              throw new Error('Failed to fetch category data');
          }
          const data = await response.json();
          setCategoryData(data);
      } catch (error) {
          console.error('Error fetching category data:', error);
      }
  
      try {
          let response = await fetch("https://localhost:7183/api/Product/GetProductCategory", {
              method: 'GET',
              headers: {
                  "Content-Type": 'application/json',
                  "Accept": 'application/json'
              }
          });
          if (!response.ok) {
              throw new Error('Failed to fetch product category data');
          }
          const data = await response.json();
          setProductCategoryData(data);
      } catch (error) {
          console.error('Error fetching product category data:', error);
      } finally {
          setLoading(false);
      }
  };
  
  const getCarts = async () => {
    if (!data || !data.userId) {
      
      return;
  }
      try {
          let result = await fetch(`https://localhost:7183/api/Cart/getCartsForUser/${data.userId}`, {
              method:'GET',
              headers: {
                  "Content-Type": 'application/json',
                  "Accept": 'application/json'
              }
          });
          if (!result.ok) {
            if(result.status == '403') {
              setLoading2(false);
              setCartData('');
              return;
            }
              throw new Error(result.status);
          }
          result = await result.json();
          setCartData(result);
      } catch (error) {
          // console.error(error.code, error);
      } finally {
          setLoading2(false);
      }
  };
  
  const tryEnterProfile = () => {
      savedData ? navigate("/profile") : navigate("/login");
  };
  const removeFromCart = async(cart) => {
    // alert(cart.cartId);
    try {
      let response = await fetch('https://localhost:7183/api/Cart/removeCart/'+cart.cartId, {
          method:'DELETE',
          headers: {
              "Content-Type": 'application/json',
              "Accept": 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Failed to remove product to cart');
      }
      response = await response.json();
      getCarts();
  } catch (error) {
    getCarts();
  }
  }
  const submitOrder = async() => {
    const info = {
      userId: data.userId,
  };
  try {
      let response = await fetch('https://localhost:7183/api/Order/MakeOrder', {
          method:'POST',
          body : JSON.stringify(info),
          headers: {
              "Content-Type": 'application/json',
              "Accept": 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Failed to create order');
      }
      response = await response.json();
      getOrders();
      
      formOrderDetails(response.orderId);
  } catch (error) {
      console.error('Error creating order:', error);
  }
  }
  const getOrders = async()=> {
    try {
      let response = await fetch('https://localhost:7183/api/Order/GetOrdersForUser/'+data.userId, {
          method:'GET',
          headers: {
              "Content-Type": 'application/json',
              "Accept": 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Failed to get user orders');
      }
      response = await response.json();
      setOrderData(response);
      setLoading3(false);
  } catch (error) {
      console.error('Error getting user order details:', error);
  }}

  const getOrderDetails = async()=> {
    try {
      let response = await fetch('https://localhost:7183/api/Order/GetOrderDetailsForUser/'+data.userId, {
          method:'GET',
          headers: {
              "Content-Type": 'application/json',
              "Accept": 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Failed to create order');
      }
      response = await response.json();
      setOrderDetailsData(response);
  } catch (error) {
      console.error('Error creating order:', error);
  }}
  const formOrderDetails = async(o_Id) => {
    cartData.map(async (cart)=>{
      const info = {
        orderId: o_Id,
        productId: cart.productId,
        quantity: cart.amount,
        discount: cart.discount,
        price: cart.totalPrice
    };
    try {
      let response = await fetch('https://localhost:7183/api/Order/CreateOrderDetail', {
          method:'POST',
          body : JSON.stringify(info),
          headers: {
              "Content-Type": 'application/json',
              "Accept": 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Failed to create order');
      }
      response = await response.json();
      setOrderDetailsData(response);
  } catch (error) {
      console.error('Error creating order:', error);
  }
    })
    removeCarts();
  }
  const removeCarts = async () => {
    let response = await fetch('https://localhost:7183/api/Cart/removeCartsForUser/'+data.userId,{
      method:'DELETE',
      headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
      }
  })
  getCarts();
  }
  const addToCart = async (product) => {
        
      const info = {
          userId: data.userId,
          productId: product.productId
      };
      try {
          let response = await fetch('https://localhost:7183/api/Cart/makeCart', {
              method:'POST',
              body : JSON.stringify(info),
              headers: {
                  "Content-Type": 'application/json',
                  "Accept": 'application/json'
              }
          });
          if (!response.ok) {
            alert("No products available or something went wrong!");
              throw new Error('Failed to add product to cart');
          }
          response = await response.json();
          getCarts();
      } catch (error) {
          console.error('Error adding product to cart:', error);
          
      }
  };
  function testfunc() {
    alert(orderData.map((order)=>(order.orderId)));
  }
  if (loading2   || !data ||loading || loading3) {
      return <div>Loading...</div>; 
  }
 return (
  <div className={productData.length === 0 ? 'whole-page out-of-stock' : 'whole-page'}>
    <Orders product={productData} orders={orderData} orderDetails={orderDetailsData} show={showOrders} handleShow={handleShowOrders} cartData={cartData} product={productData} removeFromCart={removeFromCart} submitOrder={submitOrder} />
    <Cart show={show} handleShow={handleShow} cartData={cartData} product={productData} removeFromCart={removeFromCart} submitOrder={submitOrder} />
    {/* <button onClick={testfunc}/> */}
    <div className='main-header'>
      <button onClick={handleShow} className='nav-buttons'>
        <img src={CartImage} alt="Cart icon" />
        <div className="cart-info"></div>
      </button>
      <button onClick={tryEnterProfile} className='nav-buttons'>
        <img src={User} alt="User icon" />
        <div className="user-info">{data.login}</div>
      </button>
      <button onClick={handleShowOrders} className='nav-buttons'>
        <img src={OrderImage} alt="Order icon" />
        <div className="user-info"></div>
      </button>
      <button onClick={() => {
        navigate("/shop");
      }} className='nav-buttons home-info'>
        <img src={Guns} alt="Home icon" />
        <div className="home-info"></div>
      </button>
    </div>
    <div className='shop'>
      <div className='shop-headers'>
        <h1>Weapons</h1>
        <div className='categories'>
          <p className='categ' onClick={() => setSelectedCategory('All')}>All</p>
          <p className='categ' onClick={() => setSelectedCategory('Ranged')}>Ranged</p>
          <p className='categ' onClick={() => setSelectedCategory('Melee')}>Melee</p>
          <p className='categ' onClick={() => setSelectedCategory('Ammo')}>Ammo</p>
          <p className='categ' onClick={() => setSelectedCategory('Pistol')}>Pistol</p>
          <p className='categ' onClick={() => setSelectedCategory('Rifle')}>Rifle</p>
        </div>
      </div>
      {productData.length === 0 ? (
        <div className="out-of-stock-message">Out of stock</div>
      ) : (
        <ProductCard
          product={productData.filter(product => {
            if (selectedCategory === 'All') {
              return true;
            } else {
              return categoryData
                .filter(cat => productCategoryData.some(pCat => pCat.categoryId === cat.categoryId && pCat.productId === product.productId))
                .some(cat => cat.categoryName === selectedCategory);
            }
          })}
          category={categoryData}
          productCategory={productCategoryData}
          addToCart={addToCart}
        />
      )}
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  </div>
);

}