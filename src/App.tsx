// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useEffect } from 'react';

import { Routes, Route, useNavigate } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import { getLoading } from './store/appSlice';
import Loading from './components/Loading';
import { ModalProvider } from './components/ModalContext';
import ComaplaintDetail from './pages/ComaplaintDetail';


function App() {
  // const dispatch = useDispatch()
  const loading = useSelector(getLoading)
  useEffect(() => {
    // setTimeout(()=>{
    //   dispatch(setLoaing(false))
    // },2000)
  }, [])

  return (
    <   >
      <ModalProvider>

        {loading && <Loading open={false} />}

        <div className="app-shell">
          <div className="main-content">
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
              <Route path='/activities/detail' element={<ActivitieDetail />} />
              <Route path='/register' element={<Register />} />
              {/* <Route path='/scroll' element={<ScrollBounceDemo/>} /> */}

            </Routes>
          </div>
          {isAuthenticated() && (<>
            <PageHeader />
            <NavApp /> </>)
          }
        </div>
      </ModalProvider> 
    </>
  )
}

export default App

function useStableViewport() {
  useEffect(() => {
    // ตั้ง --svh = 1% ของความสูงหน้าจอแบบคงที่
    const setSVH = () => {
      const svh = window.screen?.height ? window.screen.height / 100 : window.innerHeight / 100;
      document.documentElement.style.setProperty("--svh", `${svh}px`);
    };
    setSVH();
    window.addEventListener("orientationchange", setSVH);
    // บาง webview เปลี่ยนค่าเมื่อกลับจากพื้นหลัง
    document.addEventListener("visibilitychange", () => { if (!document.hidden) setSVH(); });

    return () => {
      window.removeEventListener("orientationchange", setSVH);
    };
  }, []);
}

function useKeyboardClass() {
  useEffect(() => {
    const onFocusIn = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA|SELECT/)) {
        document.body.classList.add("keyboard-open");
      }
    };
    const onFocusOut = () => document.body.classList.remove("keyboard-open");

    // บาง in-app browser ไม่มี visualViewport ที่เชื่อถือได้
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, []);
}
export function AppRoot() {
  useStableViewport();
  useKeyboardClass();
  return <App />;
}

const RedirectToRegister: React.FC = () => {
  const navigate = useNavigate(); 
  useEffect(() => { 
    setTimeout(() => {
      navigate('/register');
    }, 1000)
  }, []);

  return (
    <div className="fixed bg-gray-500  flex items-center justify-center "
      style={{ zIndex: 999, backgroundColor: " white", position: "fixed", top: "0", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <img src='../../assets/loading.gif' style={{ width: "4rem", marginTop: "-2rem" }} />
    </div>
  );
};