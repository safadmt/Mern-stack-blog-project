import { useState } from 'react';
import { UserContext } from './context/Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar';
import Home from './component/Home';
import Login from './component/Login';
import Register from './component/Register';
import Profile from './component/Profile';
import Sidebar from './component/Sidebar';
import CreateNewPost from './component/CreateNewPost';
import ViewPost from './component/ViewPost';
import EditPost from './component/EditPost';
import './App.css';
function App() {
  const [userInfo,setUserInfo] = useState(null);
  return (
    <div className="mainpage">
      <div>
        <BrowserRouter>
          <UserContext.Provider value={{userInfo,setUserInfo}}>
            <Routes>
            <Route path='/' element={<Navbar />}>
              <Route index element={<Home />} />
              <Route path='/user/login' element={<Login />} />
              <Route path='/user/register' element={<Register />} />
              <Route path='/user/:userId' element={<Profile />}/>
              <Route path='/user/:userId/create-new-post' element={<CreateNewPost/>}/>
              <Route path='/posts/:postId' element={<ViewPost/>}/>
              <Route path='/user/:userId/edit-post/:postId' element={<EditPost/>}/>
            </Route>

          </Routes>
          </UserContext.Provider>
          
        </BrowserRouter>
      </div>


    </div>
  );
}

export default App;