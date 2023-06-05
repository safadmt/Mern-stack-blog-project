import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const Home = ()=> {
    const [post,setPosts] = useState([]);
    useEffect(()=> {
        axios.get('http://localhost:4000/posts/get-posts')
        .then(res=> {
            console.log(res.data)
            setPosts(res.data)
            
        }).catch(err=> {
            console.log(err)
        })
    },[])
    
    return (
        
        <div className="col-md-8" style={{margin: "auto"}}>
            {post.length > 0 && post.map((post, index)=> {
                
                return<div className="d-flex blogdiv">
                <Link to={`/${post._id}`} className="postLink"> 
                <div className="divtitle">  
                <h2>{post.title}</h2>
                <p></p>
                <p></p>
                
            </div>
            </Link>
            <div className="divblogcontent">
                <Link to={`/${post._id}`} className="postLink">
                <p dangerouslySetInnerHTML={{ __html:post.summary}}/>
                </Link>
            </div>
            <div id="imgdiv" className="divblogcontent">
                <Link to={`/posts/${post._id}`} className="postLink">
                <img src={`http://localhost:4000/images/${post.filename}`}></img>
                </Link>
            </div>
            </div>
            })}
            
        </div>
    )
}

export default Home;