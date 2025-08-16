 
import { useNavigate } from 'react-router-dom';
import "./css/NavApp.css"
import { useEffect, useState } from "react";
import { getDefaultCompay } from '../action';
import { BouceAnimation } from './Animations';
const apiUrl = import.meta.env.VITE_API;


const NavApp=()=>{
  const navigate = useNavigate();
  const [name,setName] = useState("")

  useEffect(()=>{
    console.log(" window.location.pathname ", window.location.pathname)
            const getcompanydetail=async ()=>{
                const companyapp = await getDefaultCompay()
                console.log("companyapp  ",companyapp)
                setName(companyapp?.name) 
            }
            getcompanydetail()
   },[ window.location.pathname])
    
    return( 
   <BouceAnimation duration={0.44}> 
  <div className="set-column bottom-nav noselect" >
   <div className="wrapper-bottom-nav set-column" >
    <div className="left-wrapper-bottom-nav" >
        <div 
         className={ window.location.pathname.match("/profile") ? "highlight nav-item ":"nav-item" }
         onClick={()=>{ navigate('/profile', { viewTransition: true });}} style={{width:"50%"}}  aria-valuetext="profile" >
            
            <img src={apiUrl+"/images/svg/person.svg"} alt="Profile" />
            <span className="text-xs">Profile</span>
        </div>
        <div className={`nav-item ${window.location.pathname.indexOf("/complaint") > -1 ?"highlight":""}`} style={{width:"50%"}} 
         onClick={()=>{ navigate('/complaint', { viewTransition: true });}} aria-valuetext="complaint" > 
            <img src={apiUrl+"/images/svg/complaint.svg"} alt="แจ้งเรื่อง" />
            <span className='noselect' >แจ้งเรื่องร้องทุกข์</span>
        </div> 
    </div>
    <div className="right-wrapper-bottom-nav" >
        <div className={`nav-item ${window.location.pathname.indexOf("/activities") > -1 ?"highlight":""}`} aria-valuetext="place" style={{width:"50%"}} 
         onClick={()=>{ navigate('/activities', { viewTransition: true });}} 
        > 
            <img src={apiUrl+"/images/svg/activity.svg"} alt="กิจกรรม" />
            <span className='noselect' >สถานที่ท่องเที่ยว<br/>และกิจกรรม</span>
           
        </div>
        <div  className={`nav-item ${window.location.pathname.indexOf("/setting") > -1 ?"highlight":""}`}  aria-valuetext="setting" style={{width:"50%"}} 
         onClick={()=>{ navigate('/setting', { viewTransition: true });}} 
        >
            <img  src={apiUrl+"/images/svg/setting.svg"} alt="ตั้งค่า" />
            <span className='noselect' >ตั้งค่า</span>
        </div>
    </div>
   </div>
   <div   onClick={()=>{ navigate('/home', { viewTransition: true });}} className={`nav-item center-circle ${window.location.pathname === "/home" ? "active" :"deactive"}  `} >
      <label className='noselect' >{name}</label>
   </div>
</div>
</BouceAnimation>

    )
}
export default NavApp;