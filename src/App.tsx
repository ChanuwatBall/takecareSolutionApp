import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useEffect } from 'react';
import liff from '@line/liff';
import  { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NavApp from './components/NavApp';

import "./styles/theme.css"
import PageHeader from './components/PageHeader';
import Complaint from './pages/Complaint';
import ComplaintForm from './pages/ComplaintForm';
import Setting from './pages/Setting';
import Activities from './pages/Activities';
import ActivitieDetail from './pages/ActivitieDetail';
import Register from './pages/Register';

function App() {
  const [count, setCount] = useState(0)
  // useEffect(() => {
  //   liff.init({ liffId: "2001116231-q0zBmZEw" })
  //     .then(async () => {
  //       console.log('LIFF init success');
  //       if (!liff.isLoggedIn()) {
  //         liff.login(); 
  //       }
  //       console.log("liff token ", liff.getAccessToken())
  //       console.log("liff profile ",await liff.getProfile())
  //     })
  //     .catch((err) => {
  //       console.error('LIFF init failed', err);
  //     });
  // }, []);


  return ( 
    <div style={{background:"#FFF"}} > 
      <PageHeader />
      <NavApp />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/complaint" element={<Complaint />} /> 
        <Route path="/complaint/add" element={<ComplaintForm />} /> 
        <Route path="/setting" element={<Setting />} /> 
        <Route path="/activities" element={<Activities />} /> 
        <Route path='/activities/detail' element={<ActivitieDetail/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>
    </div>
  )
}

export default App
