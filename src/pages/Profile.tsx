import { useState } from "react";
import "./css/Profile.css"

const Profile:React.FC=()=>{
    const  [profile, setProfile]  = useState({
        profile: "../assets/images/member-profile.jpg" ,
        first_name:"นพวิชญ์" ,
        last_name:"นาคเพ่งพิศ",
        village:"หมู่ 1",
        familyMember:2 
    })
    const [complaintStatus , setConmplaiintStatus ] = useState({
        wait: 0 ,
        pending: 1,
        procesing: 1 ,
        done: 1
    })

    const [complaints , setComplaints] = useState([
        { topic:"ถนน" ,admin:"โยธาธิการ" , status: "กำลังดำเนินการ" },
        { topic:"ประปา" ,admin:"โยธาธิการ" , status: "กำลังดำเนินการ" },
        { topic:"ขยะ" ,admin:"เทศกิจ" , status: "กำลังดำเนินการ" },
    ])

    return(
    <div className="page">
        <div className="card-profile  flex items-center ">
            <div className="profile-image flex items-center" style={{justifyContent:"center"}}> 
                <div 
                    className="wrap-member-profile flex items-center justify-center ">
                    <img 
                        src={profile?.profile} 
                        alt="member-profile" 
                    />
                </div>  
            </div>
            <div className="profile-detail flex items-start justify-center column">
                <label className="profile-member-name" >{profile?.first_name} {profile?.last_name}</label>
                <div className="chip-profile" >ลูกบ้าน{profile?.village}</div>
                <div className="chip-profile" >จำนวนสมาชิกในครอบครัว {profile?.familyMember}</div>
            </div> 
        </div>

        <div className="card-complaint-count flex  items-center justify-center " >
           <img src="../assets/images/complaint-alert.png" alt="" />
           <label>จำนวนเรื่องร้องเรียน: 3 เรื่อง</label>
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
                     0
                   </div>
                   <div className="text-center  flex  items-center justify-center">
                     1
                   </div>
                   <div className="text-center flex  items-center justify-center">
                     1
                   </div>
                </div>
                <div  style={{margin:"0px",paddingLeft:".3rem"}}>
                    <div className="text-center" style={{padding:".67rem 0 .67rem",margin:"0"}}>
                        1
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
                    <div>{e?.topic}</div>
                    <div>{e?.admin}</div>
                    <div>{e?.status}</div>
                </div>
               )
           }

            

            
        </div>


    </div>
    )
}
export default Profile;