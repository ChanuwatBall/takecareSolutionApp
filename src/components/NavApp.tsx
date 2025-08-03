 
import { useNavigate } from 'react-router-dom';
import "./css/NavApp.css"
import { useEffect } from "react";

const NavApp=()=>{
  const navigate = useNavigate();

  useEffect(()=>{
    console.log(" window.location.pathname ", window.location.pathname)
   },[ window.location.pathname])
    
    return( 
window.location.pathname.indexOf("register") < 0 && <div className="set-column bottom-nav " >
   <div className="wrapper-bottom-nav set-column" >
    <div className="left-wrapper-bottom-nav" >
        <div 
         className={ window.location.pathname.match("/profile") ? "highlight nav-item ":"nav-item" }
         onClick={()=>{ navigate('/profile');}} style={{width:"50%"}}  aria-valuetext="profile" >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="Profile" />
            <span className="text-xs">Profile</span>
        </div>
        <div className={`nav-item ${window.location.pathname.indexOf("/complaint") > -1 ?"highlight":""}`} style={{width:"50%"}} 
         onClick={()=>{ navigate('/complaint');}} aria-valuetext="complaint" > 
            <img src="https://img.icons8.com/ios-filled/50/ffffff/megaphone.png" alt="แจ้งเรื่อง" />
            <span>แจ้งเรื่องร้องทุกข์</span>
        </div> 
    </div>
    <div className="right-wrapper-bottom-nav" >
        <div className={`nav-item ${window.location.pathname.indexOf("/activities") > -1 ?"highlight":""}`} aria-valuetext="place" style={{width:"50%"}} 
         onClick={()=>{ navigate('/activities');}} 
        > 
            <img src="https://img.icons8.com/ios-filled/50/ffffff/calendar.png" alt="กิจกรรม" />
            <span>สถานที่ท่องเที่ยว<br/>และกิจกรรม</span>
           
        </div>
        <div  className={`nav-item ${window.location.pathname.indexOf("/setting") > -1 ?"highlight":""}`}  aria-valuetext="setting" style={{width:"50%"}} 
         onClick={()=>{ navigate('/setting');}} 
        >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/menu.png" alt="ตั้งค่า" />
            <span>ตั้งค่า</span>
        </div>
    </div>
   </div>
   <div   onClick={()=>{ navigate('/');}} className={`nav-item center-circle ${window.location.pathname === "/" ? "active" :"deactive"}  `} >
      <label> เทศบาลตำบล  บางหมาก</label>
   </div>
</div>

    )
}
export default NavApp;