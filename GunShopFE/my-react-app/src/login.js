import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './styles.css';
import { Link, useNavigate  } from 'react-router-dom';
import { useState ,useEffect} from 'react';


export function Login() {
    const[login,setLogin] = useState("");
    const[password,setPassword] = useState("");

    function testfunc() {

        let item = localStorage.getItem("user-info");
        alert(item);
    }

    const fetchData = async () => {
        let data = {
            login: login,
            password: password
        };
        //alert(JSON.stringify(data));

        let result = await fetch('https://localhost:7183/api/Users/login',{
            method:'POST',
            body : JSON.stringify(data),
            headers: {
                "Content-Type":'application/json',
                "Accept":'application/json'

            }
        }) 
        result = await result.json()
        if(result.userId) {
            localStorage.setItem("user-info",JSON.stringify(result));
            if(result.type==="admin") {
                navigate("/admin");
            }
            else{
            navigate("/shop");
            }
            console.warn(result)
            //setUser(result);
        }
        else alert("Incorrect data!")
      };
    const navigate = useNavigate();
    document.addEventListener("DOMContentLoaded", function() {
        window.scrollTo(0, 0);
    });
    useEffect(() => {
        const savedData = localStorage.getItem('user-info');
        if (savedData) {
         navigate("/shop");
        }
      }, []);
 return (
 <div className='whole-page-rl'>
   <div className='form-container'>
   <h1>Login page</h1>
   <input type = "text" value = {login} onChange={(e)=>setLogin(e.target.value)} className = "form-control"placeholder='Login'/>
   <input type = "password" value = {password} onChange={(e)=>setPassword(e.target.value)} className = "form-control"placeholder='Password'/>
   <div className='form-buttons'>
    <button onClick={fetchData}className='form-button'>Submit</button>
    <button onClick={() => {
        navigate("/register");
    }}className='form-button' >Register instead</button>
    </div>
   </div>
    {/* <button onClick={testfunc}>!!!test button!!!</button> */}
 </div>
);
}