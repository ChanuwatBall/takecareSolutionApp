// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useEffect } from 'react'; 

import  {  Routes, Route, useNavigate  } from 'react-router-dom';
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
import ProfileEdit from './pages/ProfileEdit';  
import {  useSelector } from 'react-redux';
import { getLoading } from './store/appSlice';
import Loading from './components/Loading';
import { ModalProvider } from './components/ModalContext';
import ComaplaintDetail from './pages/ComaplaintDetail';


function App() {   
  // const dispatch = useDispatch()
  const loading = useSelector(getLoading)
  useEffect(()=>{ 
    // setTimeout(()=>{
    //   dispatch(setLoaing(false))
    // },2000)
  },[ ])

  return ( 
    <   >  
    <ModalProvider> 
          
    { loading && <Loading open={false} />}
     <Routes> 
        <Route path="/" element={<RedirectToRegister />} />
        <Route path="/register" element={<Register />} />  
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />  
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/complaint" element={<Complaint />} /> 
        <Route path="/complaint/add/:type" element={<ComplaintForm />} /> 
        <Route path="/complaint/detail/:complaintId" element={<ComaplaintDetail />} /> 
        <Route path="/setting" element={<Setting />} /> 
        <Route path="/activities" element={<Activities />} /> 
        <Route path='/activities/detail' element={<ActivitieDetail/>} />
        <Route path='/register' element={<Register/>} />
        {/* <Route path='/scroll' element={<ScrollBounceDemo/>} /> */}
        
      </Routes>  
       {isAuthenticated() &&( <> 
         <PageHeader /> 
         <NavApp /> </>)
       } 
       </ModalProvider>
{/* </ScrollBounceDemo> */}
    </>
  )
}

export default App


const RedirectToRegister: React.FC = () => {
  const navigate = useNavigate();

 

  useEffect(() => {
    //   try {
    //     checklocaluser()
    //   } catch (error) {
    //   // Redirect to /register when the component is mounted
    //     setTimeout(()=>{
    //       navigate('/register');
    //     },1000)
          
    //   }
    // checklocaluser()
     setTimeout(()=>{
          navigate('/register');
        },1000)
  }, [ ]);

  return ( 
     <div className="fixed bg-gray-500  flex items-center justify-center " 
     style={{zIndex:999 , backgroundColor:" white",position:"fixed", top:"0" , width:"100vw" , height:"100vh",overflow:"hidden"}}>
       <img src='../../assets/loading.gif' style={{width:"4rem",marginTop:"-2rem"}} /> 
    </div>
  );
};