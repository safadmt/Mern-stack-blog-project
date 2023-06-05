import '../App.css';
import React, {useContext, useEffect} from 'react';
import {Link,Outlet} from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/Context';
const Navbar = ()=> {
    const {userInfo, setUserInfo} = useContext(UserContext);
    
    
    useEffect(()=> {
        axios.get("http://localhost:4000/user/auth", {withCredentials: true})
        .then(res=> { 
            setUserInfo(res.data)
        })
        .catch(err=> {
            if(err.response.request.status === 401) {
                setUserInfo(null)
            }else if(err.response.request.status === 404) {
                setUserInfo("")
            }else{
                console.log(err)
            }
            
        })
    } , [])
    console.log(userInfo)
    const handleLogout = (e)=> {
        e.preventDefault();
        axios.get('http://localhost:4000/user/logout',{withCredentials: true})
        .then(res=> {
            setUserInfo(null)

        })
        .catch(err=> {
            if(err.response.request.status === 404) {
                setUserInfo("")
            }
        })
    }
    
        return(
        <>
            <nav>
                
                <Link to='/' id='navbrand'>Techblo</Link>
                
                {userInfo ? <ul>
                    
                    <li>
                        <Link className='Link' onClick={handleLogout}>Logout</Link>
                    </li>
                    <li>
                        <Link to={`/user/${userInfo._id}`} className='Link'>Profile</Link>
                    </li>
                    
                </ul> : 
                    <ul>
                    
                    <li>
                        <Link to='/user/login' className='Link'>Login</Link>
                    </li>
                    <li>
                        <Link to='/user/register' className='Link'>register</Link>
                    </li>
                    
                </ul> 
                }
                
            </nav>
            <Outlet/>
        </>
    )
    
}

export default Navbar;