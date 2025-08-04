// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useEffect } from 'react';
import liff from '@line/liff';

import  {  Routes, Route, useNavigate } from 'react-router-dom';
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
import { isAuthenticated } from './auth';
import { getDefaultCompay, setCookie, userLineid } from './action';

function App() { 
  const navigation = useNavigate()
  useEffect(() => {
    const getAppCompany=async ()=>{
      const companyapp = await getDefaultCompay()

      console.log("companyapp ",companyapp)
      if(companyapp && companyapp?.liffId){
        liff.init({ liffId: companyapp?.liffId })
        .then(async () => {
          console.log('LIFF init success');
          if (!liff.isLoggedIn()) {
            liff.login(); 
          }
          const profile = await liff.getProfile()
          localStorage.setItem("token", JSON.stringify(liff.getAccessToken()))
          setCookie("lineProfile",profile,30)
          console.log("liff token ", liff.getAccessToken())
          console.log("liff profile ",profile)

          const usr = await userLineid(profile?.userId)
          if(usr.result ){
            navigation("/")
          }else{ 
            navigation("/register")
          }
        })
        .catch((err) => {
          console.error('LIFF init failed', err);
      }); 
      }
      // liff.init({ liffId: "2001116231-q0zBmZEw" })
      //   .then(async () => {
      //     console.log('LIFF init success');
      //     if (!liff.isLoggedIn()) {
      //       liff.login(); 
      //     }
      //     console.log("liff token ", liff.getAccessToken())
      //     console.log("liff profile ",await liff.getProfile())
      //   })
      //   .catch((err) => {
      //     console.error('LIFF init failed', err);
      // }); 
    }
    getAppCompany()
    
  }, []);


  return ( 
    <div style={{background:"#FFF"}} > 
      {isAuthenticated() && <PageHeader /> }
      {isAuthenticated() && <NavApp /> }

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/home" element={<Home />} /> */}
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
