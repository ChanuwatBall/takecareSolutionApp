import { useEffect, useState, type ReactNode } from "react";
import "./css/Profile.css"
import {  complaintsumbyuser,   deleteCookie,   getCookie,   setCookie,   userLineid } from "../action";
// import liff from "@line/liff";  
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { BouceAnimation } from "../components/Animations";
import { headersize } from "../components/PageHeader"; 
import { useModal } from "../components/ModalContext";
 
const apiUrl = import.meta.env.VITE_API;

 
const Profile:React.FC=()=>{
    const navigate = useNavigate() 
    // const [loading,setLoading] = useState(false)
    const { openComponent } = useModal();
    const [profile , setProfile]  = useState<any>(null) 
    const [familyMember , setFammember] = useState(0)
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
                const profilecookie:any = await getCookie("profile")
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
        const getuservillager=async ()=>{ 
            const member:any = await getCookie("member")
            console.log("member ",member)
            if(member ){
                setFammember(member?.fammilyMember != undefined &&member?.fammilyMember !=null? member?.fammilyMember : 0 )
            }
            try {
                
                // const profile:any = await liff.getProfile() 
                const profile:any = await getCookie("profile")
                const usr:any = await userLineid(profile?.userId)
                console.log(" usr ",usr)
                setProfile(usr?.villager)
                const complaintsumm = await complaintsumbyuser({ id: usr.id , lineId: profile?.userId});
                console.log("complaintsumm ",complaintsumm)
                setComplaintSumm(complaintsumm)
                setComplaints(complaintsumm?.complaints)
            } catch (error) {
                // SETLOADING(false) 
                console.log("error ",error)
            }  
            headersize()
        }
        getuservillager()
    },[])  


    const viewComplaint = () => {
        // setOpen(true)
        openComponent(Confirm, {
            title: "ภาพรวมการแจ้งปัญหา",
            message: <div style={{width:"100%"}} >
                <div className="grid grid-cols-2  gradient-primary rounded-md py-1" >
                    <div className="complaint-status-name flex  items-center justify-center">หัวข้อเรื่อง</div>
                    {/* <div className="complaint-status-name flex  items-center justify-center">ผู้ดูแล</div> */}
                    <div className="complaint-status-name flex  items-center justify-center">สถานะ</div>
                </div>
                {
                    complaints.map((e:any , index:any)=>
                    <div key={index} style={{marginBottom:"1rem" , borderBottom:"1px solid #ddd" , paddingBottom:".5rem"}}>
                        <div className="grid grid-cols-3  ">
                            <div className="text-left text-sm col-span-2 dark:text-black" >
                                <ul style={{paddingLeft:"1rem"}}>
                                    <li> {e?.topic}</li>
                                    <li>{e?.supTitle} </li>
                                    <li> {e?.detail}</li>
                                </ul>
                                
                               
                            </div>
                            {/* <div  className="text-center text-sm dark:text-black" >{e?.admin}</div> */}
                            <div className="text-center text-sm dark:text-black" >
                                {e?.status?.match("pending") ? "รอดำเนินการ" :
                                e?.status?.match("in-progress") ? "กำลังดำเนินการ" :
                                e?.status?.match("done") ? "เสร็จสิ้น" :
                                "ตรวจสอบ" }
                            </div>
                            
                        </div>
                        <div  className="grid grid-cols-6">
                            {e?.imageIds.map((id:any)=> 
                            <img
                                src={apiUrl+"/api/file/drive-image/"+id}
                                alt={`Image ${index}`}
                                className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
                            />
                            )}
                        </div> 
                    </div>)
                }
            </div> ,
            onConfirm: () => { console.log("confirmed!")},
        })
    }


    return(
    <PullToRefreshComponent > 
    <div  id="page" className="page"> 
        <BouceAnimation duration={0.1}> 
        <div className="card-profile  flex items-center " style={{position: "relative"}}>
            <div style={{position:"absolute",width:"1.5rem",color:"#FFF", top:"1rem", right:"1rem", opacity:"1"}}
            onClick={(()=>{navigate("/profile/edit")})}
            > <img  src={apiUrl+"/images/svg/pencil.svg"} alt="edit" /> </div>
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
                <div className="chip-profile" >จำนวนสมาชิกในครอบครัว {familyMember}</div>
            </div> 
        </div>
        </BouceAnimation>

        <BouceAnimation duration={0.3}> 
        <div className="card-complaint-count flex  items-center justify-center " onClick={()=>{viewComplaint()}} >
           <img src="../assets/images/complaint-alert.png" alt="" />
           <label>จำนวนเรื่องร้องเรียน: {complaintStatus && complaintStatus?.total} เรื่อง</label>
        </div>
        </BouceAnimation>

        <BouceAnimation duration={0.5}> 
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
                   <div className="text-center flex  items-center justify-center dark:text-black">
                     {complaintStatus && complaintStatus?.wait}
                   </div>
                   <div className="text-center  flex  items-center justify-center dark:text-black">
                     {complaintStatus &&complaintStatus?.pending}
                   </div>
                   <div className="text-center flex  items-center justify-center dark:text-black">
                     {complaintStatus &&complaintStatus?.inProgress}
                   </div>
                </div>
                <div  style={{margin:"0px",paddingLeft:".3rem"}}>
                    <div className="text-center dark:text-black" style={{padding:".67rem 0 .67rem",margin:"0"}}>
                        {complaintStatus && complaintStatus?.done}
                    </div> 
                </div>
             </div>
        </div>
        </BouceAnimation><br/>

        <BouceAnimation duration={0.5}> 
        <div className="card-complaint-status" >
            <div className="grid grid-cols-3  gradient-primary rounded-md py-1" >
                <div className="complaint-status-name flex  items-center justify-center">หัวข้อเรื่อง</div>
                <div className="complaint-status-name flex  items-center justify-center">ผู้ดูแล</div>
                <div className="complaint-status-name flex  items-center justify-center">สถานะ</div>
            </div>
             {
                complaints && complaints.map((e,index)=>
                <div key={index} className="grid grid-cols-3  py-1" >
                    <div className="text-center text-sm dark:text-black" >{e?.topic}</div>
                    <div  className="text-center text-sm dark:text-black" >{e?.admin}</div>
                    <div className="text-center text-sm dark:text-black" >
                        {e?.status?.match("pending") ? "รอดำเนินการ" :
                         e?.status?.match("in-progress") ? "กำลังดำเนินการ" :
                         e?.status?.match("done") ? "เสร็จสิ้น" :
                        "ตรวจสอบ" }
                    </div>
                </div>
               )
           }  
        </div> 
        </BouceAnimation>
    </div>
    </PullToRefreshComponent>
    )
}
export default Profile;


type ConfirmProps = {
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
};
function Confirm({ title, message, onConfirm  }: ConfirmProps) {
  const { closeAll } = useModal();
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, minWidth: 340 }}>
      <h3 style={{ marginTop: 0 , marginBottom:"1rem" }}>{title}</h3>
      <p>{message}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" ,paddingTop:"1rem" }}>
        {/* <button onClick={() => { onCancel?.(); closeAll(); }}>Cancel</button> */}
        <button onClick={() => { onConfirm(); closeAll(); }}>ปิด</button>
      </div>
    </div>
  );
}
 