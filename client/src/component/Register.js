import "../App.css";
import { useState ,useContext} from "react";
import axios from 'axios';
import { UserContext } from "../context/Context";
import { Navigate } from "react-router-dom";
const Register = ()=> {

    const [formData , setFormData] = useState({name: '', email: '', password: ''});
    const [message, setMessage] = useState(null);
    const {userInfo,setUserInfo} = useContext(UserContext);

    const handleChanage = e => {
        e.preventDefault();
        const {name, value} = e.target;

        setFormData({...formData, [name]: value})
    }

    const handleSubmit = e => {
        e.preventDefault();

        const {name, email, password} = formData;

        if(!name || !email || !password) 
        return setMessage("Required all the field");
        if(password.length <= 3)
        return setMessage("Password must have 4 charactors long");

        const newformData = new FormData();
        newformData.append('name', name);
        newformData.append('email', email);
        newformData.append('password', password);
        console.log(newformData)
        axios({method: 'post',
            url: 'http://localhost:4000/user/register',
            data: newformData,
            headers: {'Content-Type':'application/json'}
        }).then(res=> { 
            console.log(res)
            if(res.request.status === 201) {
                console.log(res.data)
                setMessage("Registration successfull")
                setUserInfo(res.data)
            }
        }).catch(err=> {
            if(err.request.status === 401) {
                setMessage("Email already exist , use another one")
            }else{
                throw err
            }
        })
        
    }
    if(userInfo) {
        
        return <Navigate to='/'/>
    }else{
    return (
        <div id="formLogin">
            <h3 className='text-center'>Register</h3>
            <div>{message}</div>
            <div>
                <form method="post" onSubmit={handleSubmit}>
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" id="name" className="form-control" onChange={handleChanage}/>
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="text" name="email" id="email" className="form-control" onChange={handleChanage}/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="text" name="password" id="password" className="form-control" onChange={handleChanage}/>
                    </div>
                    <button type='submit' className='btn btn-outline-primary mt-2'>Submit</button>
                </form>
            </div>
        </div>
    )
    }
}

export default Register;