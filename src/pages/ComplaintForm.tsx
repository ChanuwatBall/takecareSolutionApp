


import { useState } from "react";
import "./css/Complaint.css"
import "./css/ComplaintForm.css"
import { useNavigate } from "react-router-dom";

const ComplaintForm=()=>{
    const [topic,setTopic] = useState("")
    const navigate = useNavigate();

    return(
        <div className="page grid" >
        <div className="title-row set-row" style={{flexDirection:"row-reverse"}} >
            <div className="complaint-button-title" style={{justifyContent:"center"}}>
                {/* <div className="wrap-img" >
                    <img src="assets/images/Asset12@3x.png" />
                </div> */}
                <label>รับเรื่องร้องทุกข์</label>
            </div>
            <div className="topleft-continue-complaint-menu" >  </div>
        </div> 
        <div  className="complaints-menu" >
            <div className="row-input row" >
                <label className="title" >หัวข้อเรื่อง: </label>
                <div className="input" >
                    <input placeholder="หัวข้อเรื่อง" value={topic} onChange={(e)=>{setTopic("")}}>
                    </input>
                </div>
            </div>
             <div className="row-input flex column " style={{alignItems:"flex-start"}} >
                <label className="title" >หัวข้อเรื่องย่อย* </label>
                <div className="input" >
                    <input placeholder="โปรดเลือก" value={topic} onChange={(e)=>{setTopic("")}}>
                    </input>
                </div>
            </div>
             <div className="row-input row" >
                <label className="title" >เบอร์โทรที่สามารถติดต่อได้: </label>
                <div className="input" >
                    <input placeholder="090-000-000" value={topic} onChange={(e)=>{setTopic("")}}>
                    </input>
                </div>
            </div>

             <div className="row-input flex column " style={{alignItems:"flex-start"}} >
                <label className="title" >รายละเอียด (ระบุชื่อซอย,ถนน) </label>
                <div className="input" >
                    <textarea  value={topic} onChange={(e)=>{setTopic("")}}>
                    </textarea>
                </div>
            </div>
            <div className="row-input flex row " style={{alignItems:"flex-start"}} >
                <label className="title" > แนบรูป (ไม่เกิน 5 รูป)</label>
                <button >
                    <img src="../assets/images/camera.png"  />
                    <label>ถ่ายรูป</label>
                </button>
                
                <button>
                     <img src="../assets/images/picture.png"  />
                    <label>แนบรูป</label>
                </button>
            </div>
            <div className="row-input "  >
                <button className="back" onClick={()=>{navigate(-1)}} >
                    <label>ย้อนกลับ</label>
                </button>
                 <button className="next" >
                    <label>ถัดไป</label>
                </button>
            </div>

        </div>

        </div>
    )
}

export default ComplaintForm;