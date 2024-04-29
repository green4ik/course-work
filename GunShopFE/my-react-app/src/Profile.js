import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './styles.css';
import User from './images/user.png';
import Cart from './images/shopping-cart.png'   ;
import Guns from './images/guns.png';
import {useState, useEffect} from 'react';
import { Register } from './register';
import { Link, useNavigate  } from 'react-router-dom';
export function Profile() {
    const [_data, setData] = useState('');
    useEffect(() => {
        const savedData = localStorage.getItem('user-info');
        if (savedData) {
          const userData = JSON.parse(savedData); 
          setData(userData);
          setName(userData.firstName);
          setSurname(userData.lastName);
          setEmail(userData.email);
          setPhone(userData.phoneNumber);
          setPassport(userData.passport);
          setPassword(userData.password);
          setLogin(userData.login);
          setAddress(userData.address);
        }
      }, []);
    const[first_name,setName] = useState('');
    const[email,setEmail] = useState('');
    const[login,setLogin] = useState('');
    const[password,setPassword] = useState('');
    const[last_name,setSurname] = useState('');
    const[address,setAddress] = useState('');
    const[phone_number,setPhone] = useState('');
    const[passport,setPassport] = useState('');

    async function editUser() {
        let data = {
            firstName: first_name,
            email: email,
            login: login,
            password: password,
            lastName: last_name,
            address: address,
            phoneNumber:phone_number,
            passport:passport
        };
        // alert(JSON.stringify(data));
        let fetchString = 'https://localhost:7183/api/Users/edit/' +_data.userId;
        //alert(_data.userId)
        let result = await fetch(fetchString,{
            method:'PUT',
            body : JSON.stringify(data),
            headers: {
                "Content-Type":'application/json',
                "Accept":'application/json'

            }
        }) 
        result = await result.json()
        if(result.userId) {
            localStorage.setItem("user-info",JSON.stringify(result));
            console.warn(result)
        }else alert(("Incorrect data or user exists!"));

    }

    
    const navigate = useNavigate();
    

    function submit() {
      
        editUser();
    }
    function cancel() {
        navigate("/shop")
    }
    function logout() {
        localStorage.removeItem('user-info');
        navigate("/login");
    }
    document.addEventListener("DOMContentLoaded", function() {
        window.scrollTo(0, 0);
    });
 return (
 <div className='whole-page'>
    <div className='main-header'>
       
        <button onClick={() => {
        navigate("/shop");
    }}className='nav-buttons home-info'>
            <img src={Guns} alt="Home icon" />
            <div className="home-info"></div>
            </button>   
    </div>
    <div className='form-container'>
        <div className='form-container-2'>
      <div>
        <div>
        <label className='form-label'>Name:</label>
            <input type = "text"  defaultValue={_data.firstName}  onChange={(e)=>setName(e.target.value)} className = "form-control"/>
        </div>
        <div>
        <label className='form-label'>Surname:</label>
            <input type = "text" defaultValue={_data.lastName} onChange={(e)=>setSurname(e.target.value)} className = "form-control"/>
        </div>
        <div>
        <label className='form-label'>Address:</label>
            <input type = "text" defaultValue={_data.address} onChange={(e)=>setAddress(e.target.value)} className = "form-control"/>
        </div>
        <div>
        <label className='form-label'>Phone:</label>
            <input type = "text" defaultValue={_data.phoneNumber} onChange={(e)=>setPhone(e.target.value)} className = "form-control"/>
        </div>
       
      </div>
      <div>
      <div>
        <label className='form-label'>Email:</label>
            <input type = "text" defaultValue={_data.email} onChange={(e)=>setEmail(e.target.value)} className = "form-control"/>
        </div>
        <div>
        <label className='form-label'>Passport:</label>
            <input type = "text" defaultValue={_data.passport} onChange={(e)=>setPassport(e.target.value)} className = "form-control"/>
        </div>
        <div>
        <label className='form-label'>Login:</label>
            <input type = "text" defaultValue={_data.login} onChange={(e)=>setLogin(e.target.value)} className = "form-control"/>
        </div>
        <div>
        <label className='form-label'>Password:</label>
            <input type = "text" defaultValue={_data.password} onChange={(e)=>setPassword(e.target.value)} className = "form-control"/>
        </div>
      </div>
      </div>
      <div className='form-buttons'>
        <button onClick={submit} className='form-button'>Submit</button>
        <button onClick={cancel} className='form-button'>Cancel</button>
        <button onClick={logout} className='form-button'>Log out</button>
      </div>
    </div>
 </div>
);
}