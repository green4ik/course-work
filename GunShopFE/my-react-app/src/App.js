import {Routes,Route,Link, Navigate} from 'react-router-dom';
import { Register } from './register';
import { MainPage } from './mainpage';
import { Login } from './login';
import { Profile } from './Profile';
import { AdminPage } from './AdminPage';
export function App() {
    return(
        <Routes>
            <Route path = "/" element={<Navigate to="/register" />}></Route>
            <Route path = "/login" element = {<Login/>}></Route>
            <Route path = "/register" element = {<Register/>}></Route>
            <Route path = "/shop" element = {<MainPage/>}></Route>
            <Route path = "/profile" element = {<Profile/>}></Route>
            <Route path = "/admin" element = {<AdminPage/>}></Route>
        </Routes>

    );
}