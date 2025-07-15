import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./css/NavApp.css"
import { useEffect } from "react";

const NavApp=()=>{
  const navigate = useNavigate();

  useEffect(()=>{
    console.log(" window.location.pathname ", window.location.pathname)
   },[ window.location.pathname])
    
    return( 
<div className="set-center bottom-nav " >
   <div className="wrapper-bottom-nav set-center" >
    <div className="left-wrapper-bottom-nav" >
        <div 
         className={ window.location.pathname.match("/profile") ? "highlight nav-item ":"nav-item" }
         onClick={()=>{ navigate('/profile');}} style={{width:"50%"}} >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="Profile" />
            <span>Profile</span>
        </div>
        <div className="nav-item" style={{width:"50%"}}>
            <img src="https://img.icons8.com/ios-filled/50/ffffff/megaphone.png" alt="แจ้งเรื่อง" />
            <span>แจ้งเรื่องร้องทุกข์</span>
        </div> 
    </div>
    <div className="right-wrapper-bottom-nav" >
        <div className="nav-item" style={{width:"50%"}}> 
            <img src="https://img.icons8.com/ios-filled/50/ffffff/calendar.png" alt="กิจกรรม" />
            <span>สถานที่ท่องเที่ยว<br/>และกิจกรรม</span>
           
        </div>
        <div className="nav-item" style={{width:"50%"}}>
            <img src="https://img.icons8.com/ios-filled/50/ffffff/menu.png" alt="ตั้งค่า" />
            <span>ตั้งค่า</span>
        </div>
    </div>
   </div>
   <div className="nav-item center-circle   " >
       เทศบาลตำบล  บางหมาก
   </div>
</div>

    )
}
export default NavApp;