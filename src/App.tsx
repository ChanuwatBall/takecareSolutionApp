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
function App() {  
  useEffect(() => { 
    
  }, []);


  return ( 
    <   > 
       {isAuthenticated() &&( <> 
         <PageHeader /> 
         <NavApp /> </>)
       }
      {isAuthenticated() ?(  <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/complaint" element={<Complaint />} /> 
        <Route path="/complaint/add/:type" element={<ComplaintForm />} /> 
        <Route path="/setting" element={<Setting />} /> 
        <Route path="/activities" element={<Activities />} /> 
        <Route path='/activities/detail' element={<ActivitieDetail/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>):(
      <Routes> 
        <Route path="/" element={<RedirectToRegister />} />
        <Route path="/register" element={<Register />} />  
      </Routes>)
      }

    </>
  )
}

export default App


const RedirectToRegister: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /register when the component is mounted
    navigate('/register');
  }, [navigate]);

  return (
    <div className='page' >
      {/* Optionally, you can display a message while redirecting */}
      <p>Redirecting to register...</p>
    </div>
  );
};