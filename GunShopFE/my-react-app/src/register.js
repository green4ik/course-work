import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './styles.css';
import { Link, useNavigate  } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import { useState,useEffect } from 'react';

export function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        const savedData = localStorage.getItem('user-info');
        if (savedData) {
         navigate("/shop");
        }
      }, []);
    const[first_name,setName] = useState("");
    const[email,setEmail] = useState("");
    const[login,setLogin] = useState("");
    const[password,setPassword] = useState("");


    async function signup() {
        let data = {
            firstName: first_name,
            email: email,
            login: login,
            password: password
        };
        //alert(JSON.stringify(data));

        let result = await fetch('https://localhost:7183/api/Users/registration',{
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
            //writeDataToChangeLog(result.userId)
            navigate("/shop");
            console.warn(result)
        }else alert(("Incorrect data or user exists!"));

    }
    document.addEventListener("DOMContentLoaded", function() {
        window.scrollTo(0, 0);
    });
    //додавання до журналу ( є тригер)
    // async function writeDataToChangeLog(id) {
    //     const currentDate = new Date();
    //     const isoString = currentDate.toISOString();
    //     alert(isoString);
    //     let data = {
    //         changeDate: isoString,
    //         changeDescription: "New user registrated!",
    //         userId: id
    //     }
    //     let result = await fetch('https://localhost:7183/api/ChangeLog/New',{
    //         method:'POST',
    //         body : JSON.stringify(data),
    //         headers: {
    //             "Content-Type":'application/json',
    //             "Accept":'application/json'

    //         }
    //     }) 
    // }
    function testfunc() {

        let item = localStorage.getItem("user-info");
        alert(item);
    }
 return (
 <div className='whole-page-rl'>
   <div className='form-container'>
   <h1>Register page</h1>
   <input type = "text" value = {first_name} onChange={(e)=>setName(e.target.value)} className = "form-control"placeholder='Name'/>
   <input type = "text" value = {email}onChange={(e)=>setEmail(e.target.value)} className = "form-control"placeholder='Email'/>
   <input type = "text" value = {login} onChange={(e)=>setLogin(e.target.value)} className = "form-control"placeholder='Login'/>
   <input type = "password" value = {password} onChange={(e)=>setPassword(e.target.value)} className = "form-control"placeholder='Password'/>
   <div className='form-buttons'>
    <button onClick = {signup}className='form-button'>Submit</button>
    <button onClick={() => {
        navigate("/login");
    }}className='form-button' >Login instead</button>
    </div>
   </div>
   {/* <button onClick={testfunc}>!!!test button!!!</button> */}
 </div>
);
}