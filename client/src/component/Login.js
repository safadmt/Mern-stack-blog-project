import '../App.css'
import {useState, useContext} from 'react';
import axios from 'axios';
import {Navigate} from 'react-router-dom';
import { UserContext } from '../context/Context';
const Login = () => {
    const {userInfo, setUserInfo} = useContext(UserContext)
    const [formData, setFormData] = useState({email: '', password: ''});
    const [message, setMessage] = useState(null)
    const [isAuth, setisAuth] = useState(false)
    const handleChange = (e)=> {
        e.preventDefault();
        const {name, value} = e.target;
        setFormData({...formData, [name]: value });
    }

    const handleSubmit = e => {
        e.preventDefault();
        const {email, password} = formData;
        if(!email || !password) return setMessage("Email and Password required");
        if(password.length < 4) return setMessage("Password must have 4 charactors long");
       
        const newformData = new FormData();
        newformData.append('email',email);
        newformData.append('password',password);
        
        axios({method: 'post',
        url: 'http://localhost:4000/user/login',
        data: newformData,
        headers: {'Content-Type':'application/json'},
        withCredentials: true
    }).then(res=> {
            
            if(res.data) {
                
                setUserInfo(res.data)
            }
        })
        .catch(err=> {
            setMessage(err.response.data)
        })
        

    }
    if(userInfo) {
        return <Navigate to='/' />
    }else {
    return (

        <div id="formLogin">
            <h3 className='text-center'>Login</h3>
            <div>
                <form action='' method='post' onSubmit={handleSubmit}>
                    <div bg='danger'>{message}</div>
                    <div>
                        <label>Email</label>
                        <input type="text" name="email" id="email" className="form-control" onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="text" name="password" id="password" className="form-control" onChange={handleChange}/>
                    </div>
                    <button type='submit' className='btn btn-outline-primary mt-2'>Submit</button>
                </form>
            </div>
        </div>
    )
    }
}

export default Login;