import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/Context";

const ViewPost = ()=> {
    const {postId} = useParams();
    const [postInfo, setPostInfo] = useState('');
    const [comment, setComment] = useState('');
    const {userInfo, setUserInfo} = useContext(UserContext);
    const [warmmessage, setWarnMessage] = useState('');
    const [commentsInfo, setCommentsInfo] = useState([]);
    const [followMessage, setFollowMessage] = useState("");
    const [author, setAuthor] = useState('')
    const [followbtn, setFollowBtn] = useState("Follow")
    useEffect(()=> {
        axios.get(`http://localhost:4000/posts/post-and-author/${postId}`)
        .then(res=> {
            console.log(res.data)
            setPostInfo(res.data)
            setAuthor(res.data)
            setCommentsInfo(res.data.comments)
        }).catch(err=> {
            console.log(err)
        })
    } , [])
    const handleCheck = (e)=> {
        if(!userInfo)
        return setWarnMessage("Please Login to comment")
    }

    const handleSubmit = (e)=> {
        
        e.preventDefault();
        console.log("hello safad")
        if(!userInfo) {
            return setWarnMessage("Please login to comment")
        }else{
    
        console.log(userInfo)
        if(!comment) return setWarnMessage("Please give comment");
        console.log(comment)
        const formdata = new FormData();
        formdata.append('comment', comment);
        axios({method: 'post',
        url:  `http://localhost:4000/posts/add-comment/${postId}`,
        data: formdata,
        headers: {'Content-Type':'application/json'},
        withCredentials: true
    }).then(res=>{
        console.log(res.data)
    }).catch(err=> {
            if(err.response.request.status === 401) {
                setWarnMessage("")
            }else if(err.response.request.status === 404) {
                console.log("hello")
                setUserInfo(null);
            }else{
                console.log(err)
            }
        })

        }
    }
    const handleClick = (e)=> {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("authorid" , postInfo.authorid._id)
        axios.put(`http://localhost:4000/user/followers`,formdata, {
            headers: {"Content-Type": "application/json"},withCredentials: true
        }).then(response=> {
            if(response.data.followers.includes(userInfo._id)){
                
                setFollowBtn("Following")
            }else{
                
                setFollowBtn("Follow")
            }
        }).catch(err=> {
            if(err.response.request.status === 404){
                setFollowMessage("Please login")
                setUserInfo("")
            }else if(err.response.request.status === 500){
                console.log(err.response.data.err)
            }else if(err.response.request.status === 401) {
                setFollowMessage("Please login")
                setUserInfo("")
            }
        })
    }
    return (
        <div>
            <div className="row m-5">
                <div className="col-md-8 p-3">
                    <div className="m-auto">
                        <h2>{postInfo.title}</h2>
                        <p></p>
                    </div>
                    <div className="m-auto mb-4">
                        <img src={`http://localhost:4000/images/${postInfo.filename}`} style={{width: "700px"}}/>
                    </div>
                    <div className="m-auto">
                        <h5 className="mb-3">{postInfo.summary}</h5>
                        <p dangerouslySetInnerHTML={{__html:postInfo.content}}/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="text-danger">{followMessage}</div>
                    <div className="pt-4 ps-4" style={{backgroundColor:"#EEE3CB"}}>
                       <div>
                       <h5 className="fw-bold">{postInfo?.authorid?.name}</h5>
                       <p><span className="me-3"><i class="fa-solid fa-envelope"></i></span>{postInfo?.authorid?.email}</p>
                        <p>UX , UI designer</p>
                        <button className="btn btn-primary" onClick={handleClick}>{followbtn}</button>
                       </div>
                       <div className="pt-4"> 
                        <p>10 K followers</p>
                       </div>
                    </div>
                    <div className="p-3 commentdiv">
                        <div style={{width:"300px"}} className="p-2 mb-5">
                            <p>Comment here</p>
                            <p className="text-danger">{warmmessage}</p>
                            <form method="put" onSubmit={handleSubmit}>
                                <textarea type="text" name="comment" className="form-control"
                                 onChange={(e)=> setComment(e.target.value)}/>
                                 <button className="btn btn-success mt-2" type="submit">Submit</button>
                            </form>
                        </div>
                        <div>Comments</div>
                        <div className="mt-2">
                            {commentsInfo.length > 0 && commentsInfo.map((comment,index)=> {
                                return<div className="">
                                <p className="me-2 fw-bold opacity-75 mb-0">{comment.email} :</p>
                                <p>{comment.comment}</p>
                            </div>
                            })}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPost;