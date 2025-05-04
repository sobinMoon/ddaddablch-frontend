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

function App() {
  return (
    <Routes>
      <Route element={<LayoutwithNav />}>
        <Route path='/' element={<Home />} />
        <Route path='/donate' element={<Donate />} />
        <Route path='/reviews' element={<Reviews />} />
        <Route path='/community' element={<Community />} />
        <Route path='/campaign/:id' element={<Campaign />} />
      </Route>

      <Route element={<LayoutwithoutNav />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;
