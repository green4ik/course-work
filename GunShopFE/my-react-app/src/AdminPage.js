import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminSupplies from './AdminSupplies'
import AdminLogs from './AdminLogs';
import  AdminStats  from './AdminStats';
export function AdminPage() {

    const [data, setData] = useState('');
    const navigate = useNavigate();
    const savedData = localStorage.getItem('user-info');
    useEffect(() => {
        if (savedData) {
            const userData = JSON.parse(savedData);
            if(userData.type!='admin') {
                navigate('/shop');
                alert("You are not an admin!");
            } 
            setData(userData);
        }
    }, []);
   
    

    return (
        <Tabs
          defaultActiveKey="users"
          id="justify-tab-example"
          className="mb-3"
          justify
          
        >
          <Tab eventKey="users" title="Users">
            <AdminUsers/>
          </Tab>
          <Tab eventKey="orders" title="Orders">
            <AdminOrders/>
          </Tab>
          <Tab eventKey="products" title="Products">
            <AdminProducts/>
          </Tab>
          <Tab eventKey="supplies" title="Supplies">
           <AdminSupplies/>
          </Tab>
          <Tab eventKey="log" title="Log">
            <AdminLogs/>
          </Tab>
          <Tab eventKey="stats" title="Stats">
            <AdminStats/>
          </Tab>
        </Tabs>
      );
}