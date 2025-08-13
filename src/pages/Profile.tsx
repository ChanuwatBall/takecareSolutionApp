import { useEffect, useState } from "react";
import "./css/Profile.css"
import { complaintsumbyuser,   getCookie,   setCookie,   userLineid } from "../action";
// import liff from "@line/liff"; 
import Loading from "../components/Loading";
import liff from "@line/liff";

const apiUrl = import.meta.env.VITE_API;

 
const Profile:React.FC=()=>{
    const [loading,setLoading] = useState(false)
    const [profile , setProfile]  = useState<any>(null) 
    const [complaintStatus  , setComplaintSumm] = useState({
        total: 0,
        wait: 0 ,
        pending: 1,
        inProgress: 1 ,
        done: 1 ,
        complaints: []
    })

    const [complaints ,setComplaints] = useState([
        {
            "id": 12,
            "phone": "0889768758",
            "supTitle": "ไฟถนนไม่สว่าง",
            "detail": "65 ถ.การดี",
            "status": "pending",
            "villager": 18,
            "topicId": 6,
            "topic": "ซ่อมแซม",
            "imageIds": [
                "1QWEaBRCT3koVlf0IOfD1u3kROFnWApFm",
                "1klZcnb1wb8kKmLtJFOzUUJUBGpHVe2Ad"
            ],
            "admin": "ตรวจสอบ"
        }
    ])

    useEffect(()=>{
            const checkmemberregis=async ()=>{
                const profilecookie = await getCookie("profile")
                if(profilecookie === null || profilecookie === undefined){
                     const profile:any = await liff.getProfile()
                     setCookie("profile",profile,30) 
                }
            }
            checkmemberregis()
        const getuservillager=async ()=>{
            setLoading(true) 
            try {
                
                // const profile:any = await liff.getProfile() 
                const profile = await getCookie("profile")
                const usr = await userLineid(profile?.userId)
                console.log(" usr ",usr)
                setProfile(usr?.villager)
                const complaintsumm = await complaintsumbyuser({ id: usr.id , lineId: profile?.userId});
                console.log("complaintsumm ",complaintsumm)
                setComplaintSumm(complaintsumm)
                setComplaints(complaintsumm?.complaints)
            } catch (error) {
                setLoading(false)
                console.log("error ",error)
            }
            setLoading(false)

        }
        getuservillager()
    },[])  

    return(
    <div className="page"> 
    <Loading open={loading} />
        <div className="card-profile  flex items-center ">
            <div className="profile-image flex items-center" style={{justifyContent:"center"}}> 
                <div 
                    className="wrap-member-profile flex items-center justify-center ">
                    <img 
                        src={apiUrl+"/api/file/drive-image/"+profile?.profile} 
                        alt="member-profile" 
                    />
                </div>  
            </div>
            <div className="profile-detail flex items-start justify-center column">
                <label className="profile-member-name" >{profile?.firstName} {profile?.lastName}</label>
                <div className="chip-profile" >ลูกบ้าน{profile?.villageName} {profile?.subdistrictName}</div>
                <div className="chip-profile" >จำนวนสมาชิกในครอบครัว 0</div>
            </div> 
        </div>

        <div className="card-complaint-count flex  items-center justify-center " >
           <img src="../assets/images/complaint-alert.png" alt="" />
           <label>จำนวนเรื่องร้องเรียน: {complaintStatus?.total} เรื่อง</label>
        </div>

        <div className="card-complaint-status" >
             <div className="grid grid-cols-4  " >
                <div className="col-span-3 grid grid-cols-3 gradient-primary rounded-md">
                   <div className="complaint-status-name flex  items-center justify-center">
                     รอตรวจสอบข้อมูล
                   </div>
                   <div className="complaint-status-name flex  items-center justify-center">
                     รับเรื่อง
                   </div>
                   <div className="complaint-status-name flex  items-center justify-center">
                     กำลังดำเนินการ
                   </div>
                </div>
                <div  style={{margin:"0px",paddingLeft:".3rem"}}>
                    <div className="complaint-status-name  rounded-md flex  items-center justify-center hilight  " style={{padding:".67rem 0 .67rem",margin:"0"}}>
                        เสรร็จเรียบร้อย
                    </div> 
                </div>
             </div>
             <div className="grid grid-cols-4  " >
                <div className="col-span-3 grid grid-cols-3  ">
                   <div className="text-center flex  items-center justify-center">
                     {complaintStatus?.wait}
                   </div>
                   <div className="text-center  flex  items-center justify-center">
                     {complaintStatus?.pending}
                   </div>
                   <div className="text-center flex  items-center justify-center">
                     {complaintStatus?.inProgress}
                   </div>
                </div>
                <div  style={{margin:"0px",paddingLeft:".3rem"}}>
                    <div className="text-center" style={{padding:".67rem 0 .67rem",margin:"0"}}>
                        {complaintStatus?.done}
                    </div> 
                </div>
             </div>
        </div><br/>

        <div className="card-complaint-status" >
            <div className="grid grid-cols-3  gradient-primary rounded-md py-1" >
                <div className="complaint-status-name flex  items-center justify-center">หัวข้อเรื่อง</div>
                <div className="complaint-status-name flex  items-center justify-center">ผู้ดูแล</div>
                <div className="complaint-status-name flex  items-center justify-center">สถานะ</div>
            </div>
             {
                complaints.map((e)=>
                <div className="grid grid-cols-3  py-1" >
                    <div className="text-center text-sm" >{e?.topic}</div>
                    <div  className="text-center text-sm" >{e?.admin}</div>
                    <div className="text-center text-sm" >
                        {e?.status?.match("pending") ? "รอดำเนินการ" :
                         e?.status?.match("in-progress") ? "กำลังดำเนินการ" :
                         e?.status?.match("done") ? "เสร็จสิ้น" :
                        "ตรวจสอบ" }
                    </div>
                </div>
               )
           } 
            
        </div>


    </div>
    )
}
export default Profile;