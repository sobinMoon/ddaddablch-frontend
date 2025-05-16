import React from 'react';
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Donate from './pages/Donate';
import Reviews from './pages/Reviews';
import Community from './pages/Community';
import LayoutwithNav from './layouts/LayoutwithNav';
import LayoutwithoutNav from './layouts/LayoutwithoutNav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Campaign from './pages/Campaign';
import Campaignintro from './pages/Campaignintro';
import Campaignplan from './pages/Campaignplan';
import Campaignnews from './pages/Campaignnews';
import Mypage from './pages/Mypage';
import OrganizationDetail from './pages/OrganizationDetail';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import MetaMaskAuth from './components/MetaMaskAuth';


function App() {
  return (
    <Routes>
      <Route element={<LayoutwithNav />}>
        <Route path='/' element={<Home />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/donate' element={<Donate />} />
        <Route path='/reviews' element={<Reviews />} />
        <Route path='/organization/:id' element={<OrganizationDetail />} />
        <Route path='/community' element={<Community />} />
        <Route path='/community/post/:id' element={<Post />} />
        <Route path='/community/create-post' element={<CreatePost />} />
        <Route path='/donate/campaign/:id' element={<Campaign />}>
          <Route index element={<Campaignintro />} />
          <Route path='plan' element={<Campaignplan />} />
          <Route path='news' element={<Campaignnews />} />
        </Route>
      </Route>

      <Route element={<LayoutwithoutNav />}>

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/metamask' element={<MetaMaskAuth />} />

      </Route>
    </Routes>
  );
}

export default App;
