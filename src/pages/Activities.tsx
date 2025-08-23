import { useEffect, useState } from "react";
import "./css/Activities.css"
import { useNavigate } from "react-router-dom"; 
import { activity,  deleteCookie,  getStorage, setCookie, userLineid } from "../action";
import liff from "@line/liff";
import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { BouceAnimation } from "../components/Animations";
import { headersize } from "../components/PageHeader";
const apiUrl = import.meta.env.VITE_API;



const Activities=()=>{
    const navigate = useNavigate();
    const [activities ,setActivities] = useState([])

    useEffect(()=>{ 

         const checkmemberregis=async ()=>{
            // const profilecookie:any = await getCookie("profile") 
            const profilecookie:any = await getStorage("profile")  
            // const profilecookie:any = await  getStorage("profile")
            const usr = await userLineid(profilecookie?.userId) 
            if(usr?.result &&( profilecookie === null || profilecookie === undefined)){
                 const profile:any = await liff.getProfile()
                 setCookie("profile",profile,{days:30})
            }
            if(!usr?.result){
                deleteCookie("member")
                deleteCookie("profile")
                localStorage.removeItem("token")
                      
                navigate("/")
            }
         }
         checkmemberregis() 
        const getactivities=async()=>{
            const profile:any = await getStorage("profile") // await liff.getProfile() 
            // const usr = await userLineid(profile?.userId)
            const result = await activity({lineId:profile?.userId})
            console.log("result ",result)
            setActivities(result)
        }
        getactivities() 
        headersize()
    },[])

    return(
    <PullToRefreshComponent > 
    <div id="page" className="page"><br/>
        <div className="button-title" >
            กิจกรรม
        </div> 

        <div className=" pb-9" >
            {
                activities && activities.map((act:any,inx)=>
                inx%2==0 ? 
                 <BouceAnimation duration={0.3 + (inx/100)}><div  
                    className={`card-activity ${inx%2==0?"left":"right"} grid grid-cols-3  `}  style={{ height:"9rem"}} 
                    onClick={()=>{navigate("/activities/detail", { state: { activity: act } })}}>
                    <div><div className="act-img my-1 mx-1" style={{backgroundImage:`url(${apiUrl}/api/file/drive-image/${act?.coverImagePath})`}} ></div>
                    </div>
                    <div className={`col-span-2 px-2 pl-3 flex column justify-center`}>
                        <label className="date">{act?.dateActivity}</label>
                        <label className="description">{act?.name}</label>
                    </div>
                </div> </BouceAnimation> :<BouceAnimation duration={0.3 + (inx/100)}> <div 
                    className={`card-activity ${inx%2==0?"left":"right"} grid grid-cols-3  `} 
                    onClick={()=>{navigate("/activities/detail", { state: { activity: act } })}} >
                    <div className={`col-span-2 px-2 flex column justify-center  items-end  `} style={{textAlign:"right"}}>
                        <label className="date">{act?.dateActivity}</label>
                        <label className="description">{act?.name}</label>
                    </div>
                    <div className="flex  justify-end items-end"> 
                       <div className="act-img col-span-1 my-1 mx-1" style={{backgroundImage:`url(${apiUrl}/api/file/drive-image/${act?.coverImagePath})`}} ></div>
                    </div> 
                </div></BouceAnimation>
                ) 
            }
        </div>
    </div>
    </PullToRefreshComponent>
    )
}

export default Activities;