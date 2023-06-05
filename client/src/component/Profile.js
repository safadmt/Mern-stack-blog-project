import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../context/Context";
import axios from "axios";
import '../App.css';
const Profile = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const { userId } = useParams();
    
    const [posts, setPosts] = useState([])
    const [error, setError] = useState('')
    const [passwordsuccessorerror, setPasswordsuccessorerror] = useState('')
    const [isOpen,setIsOpen] = useState(false);
    const [password,setPassword] = useState({current_password: '', new_password: '', confirm_newpassword: ''});
    useEffect(() => {
        axios.get(`http://localhost:4000/user/${userId}`, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    setUserInfo(res.data);
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    setUserInfo(null)
                }else if(err.response.request.status === 404) {
                    setUserInfo("")
                } else {
                    console.log(err)
                }
            })

        axios.get(`http://localhost:4000/posts/${userId}`, { withCredentials: true })
            .then(res => {
                
                setPosts(res.data)
            }).catch(err => {
                if (err.response.status === 401) {
                    console.log(err)
                }else if(err.response.request.status === 404) {
                    setUserInfo("")
                } else {
                    console.log(err)
                }
            })
    }, [])

    const handleDelete = (e, id) => {
        e.preventDefault();
        if(window.confirm("Do you want to delete this post permernantly")) {
            axios.delete(`http://localhost:4000/posts/delete/${id}`, { withCredentials: true })
            .then(res => {
                
                const newposts = posts.filter(post => post._id !== id);
                setPosts(newposts);
            })
            .catch(err => {
                if(err.response.status === 400) {
                    setError(err.response.data)
                }else{
                    console.log(err)
                }
            })
        }
        
        
    }
    const handleChange = (e)=> {
        e.preventDefault();
        const {name, value} = e.target;
        setPassword({...password, [name]: value})
    }
    const handlePasswordSubmit = (e)=> {
        e.preventDefault();
        console.log(password)
        const {current_password , new_password, confirm_newpassword} = password;
        if(!current_password || !new_password || !confirm_newpassword) {
            return setPasswordsuccessorerror("Required all the field")
        }else if(new_password.length < 4) {
            return setPasswordsuccessorerror("New password must be more than 3 charactors long")
        }else if(new_password !== confirm_newpassword) {
            return setPasswordsuccessorerror("Confirm password not matching to the new password")
        }
        const formdata = new FormData();
        formdata.append("current_password", current_password);
        formdata.append("new_password", new_password);
        formdata.append("confirm_newpassword", confirm_newpassword);
        axios.put(`http://localhost:4000/user/change-password/${userId}`, formdata, 
        {headers : {"Content-Type": 'application/json'},withCredentials: true})
        .then(res=> {
            setPasswordsuccessorerror("Password changed")
        }).catch(err=> {
            if (err.response.status === 401) {
                setUserInfo(null)
                console.log(err)
            }else if(err.response.request.status === 404) {
                setUserInfo("")
            } else {
                console.log(err)
            }
        })
    }
    if (userInfo) {

        return (
            <div className="row">
                <div className="row">
                    <Link to={`/user/${userInfo.userid}/create-new-post`} 
                    className="text-end fw-bold fw-1 text-decoration-none">Create new Post</Link>
                </div>
                <div className="col-md-6 m-auto mb-5" >
                    <div className="card p-3" style={{ border: "2px solid black" }}>
                        <h4>{userInfo.name}</h4>
                        <p><span className="me-3"><i class="fa-solid fa-envelope"></i></span>{userInfo.email}</p>
                        <p>Web Develper , UX designner</p>
                        <p className="ms-auto text-primary" onClick={()=> setIsOpen(isOK=> !isOK)}>Change Password?</p>
                    </div>
                    
                </div>
                {isOpen && <div className="changepassworddiv">
                        <div>{passwordsuccessorerror}</div>
                        <div className="text-danger">{error}</div>
                        <form method="post" onSubmit={handlePasswordSubmit}>
                            <input type="text" name="current_password" 
                            placeholder="Current Password" className="form-control" onChange={handleChange}/>
                            <input type="text" name="new_password" 
                            placeholder="Current Password" className="form-control" onChange={handleChange}/>
                            <input type="text" name="confirm_newpassword" 
                            placeholder="Current Password" className="form-control" onChange={handleChange}/>
                            <div className="d-flex">
                                <button type="submit" className="btn btn-outline-primary">Submit</button>
                                <button className="btn btn-outline-danger" onClick={()=> setIsOpen(isOK=> !isOK)}>Cancel</button>
                            </div>
                            
                        </form>
                    </div>}
                <div className="row mt-5">
                    
                {posts.length > 0 && posts.map((post, index) => {
                    return <div className="col-md-8 m-auto d-flex pb-2 mb-3" style={{borderBottom: '1px solid black'}}>

                        <div className="blogcontentprofile">
                            <h2>{post.title}</h2>
                            <p></p>
                            <p></p>
                        </div>
                        <div className="blogcontentprofile">
                            <p>{post.summary}</p>
                        </div>
                        <div id="imgdiv" className="">
                            <img src={`http://localhost:4000/images/${post.filename}`} style={{ width: "250px" }}></img>
                        </div>
                        <div className="ms-2">
                            <p className="text-danger editdelete" onClick={(e) => handleDelete(e, post._id)}>Delete Post</p>
                            <Link className="text-primary editdelete" to={`/user/${userId}/edit-post/${post._id}`}>Edit Post</Link>
                        </div>
                    </div>
                })}


                
                </div>
            </div>
        )
    } else {
        return <Navigate to={'/'} />
    }
}

export default Profile;