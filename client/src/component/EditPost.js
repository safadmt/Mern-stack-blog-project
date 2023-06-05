import { useState , useEffect , useContext} from "react";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ReactQuill from 'react-quill/lib';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { UserContext } from "../context/Context";
const EditPost = ()=> {
    const {userInfo, setUserInfo} = useContext(UserContext)
    const [blog, setBlog] = useState(null)
    const [postdata, setPostdata] = useState({title: '', summary: ''});
    const [file, setFiles] = useState(null);
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isfilechange, setIsFileChange] = useState(false);
    const [fileChange, setFileChange] = useState('')
    const {postId} = useParams();
    console.log(postId)
    useEffect(()=> {
        axios.get(`http://localhost:4000/posts/get-post/${postId}`)
        .then(res=> {
            // console.log(res.data);
            setBlog(res.data);
            setPostdata({...postdata, title: res.data.title, summary: res.data.summary});
            setFiles(res.data.filename);
            setContent(res.data.content)
        }).catch(err=> {
            if(err.response.request.status === 404) {
                setUserInfo("")
            }else if(err.response.request.status === 401) {
                setUserInfo("")
            }
        })
    } , [])

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']                                         // remove formatting button
      ];
       const modules = {
        toolbar: toolbarOptions,
      };
      const handleChange = (e)=> {
        e.preventDefault();
        const {name, value} = e.target;
        setPostdata({...postdata, [name]: value});
      }

      const handleFileChange = (e)=> {
        
        const fileone = e.target.files[0];
        if(fileone) {
            setFiles(e.target.files[0])
            setIsFileChange(true)
        const reader = new FileReader();
        reader.onload = ()=> {
            setFileChange(reader.result)
        }
        reader.readAsDataURL(fileone)
        }else{
            setFileChange("")
        }
        
      }
      const handleSubmit = (e)=> {
        e.preventDefault();
        const {title, summary} = postdata;

        if(!title || !summary || !file || !content)
        return setError("Required all the field")

        const newData = new FormData();
        newData.append("title", title);
        newData.append("summary", summary);
        newData.append("picture", file);
        newData.append("content" , content);
        
        axios.put(`http://localhost:4000/posts/update/${blog._id}`, newData , 
        {headers: {"Content-Type" : 'multipart/form-data'} , withCredentials: true}, )
        .then(res=> {
            setSuccess("Post Updated")
        }).catch(err=> {
            if(err.response.status === 401){
                setError(err.response.data)
            }
        })
      }
      if(userInfo){
        return (
            <div className='col-md-8' style={{margin: "auto"}}>
                <div><span className='text-success'>{success}</span></div>
                <div><span className='text-danger'>{error}</span></div>
                <form method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input type="text" name="title" value={postdata.title} className="form-control" onChange={handleChange}/>
                    <label>Summary</label>
                    <input type="text" name="summary" value={postdata.summary} className="form-control" onChange={handleChange}/>
                    <label>image</label>
                    {isfilechange=== true?  <div >
                        <img src={fileChange} style={{width: '200px'}}/>
                    </div>:<div >
                        <img src={`http://localhost:4000/images/${file}`} style={{width: '200px'}}/>
                    </div> }
                    
                    <input type="file" name="picture" className="form-control mb-2" 
                    onChange={handleFileChange}/>
                    <ReactQuill value={content} modules={modules} theme="snow" 
                    onChange={newValue=> setContent(newValue)}/>
                    <input type="submit" value='Submit' className='btn mt-2 col-md-12 fw-bold' 
                    style={{backgroundColor: "#967E76"}}/>       
                </form>
            </div>
        )
        }else{
            return <Navigate to={'/'}/>
        }
}

export default EditPost;