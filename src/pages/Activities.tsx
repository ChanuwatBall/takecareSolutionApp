import { useState } from "react";
import "./css/Activities.css"
import { useNavigate } from "react-router-dom";


const Activities=()=>{
     const navigate = useNavigate();
    const [activities , setActivities] = useState([
        { 
            startDate:"24-28 เม.ย. 67",
            endDate:"" ,
            description :`
            งานประเพณีไทยทรงดำ ณ วัดดอนรวบ โครงการผู้สูงอายุสุขภาพดี ชีวีมีสุข ครั้งที่ 1  `,
            image:"../assets/images/activity-1.jpg"
        },
        { 
            startDate:"3 มิ.ย. 65",
            endDate:"" ,
            description :`ปลูกต้นไม้ & หญ้าแฝก เฉลิมพระเกียรติฯ`,
            image:"../assets/images/activity-2.jpg"
        },
        { 
            startDate:"13 พ.ค. 65",
            endDate:"" ,
            description :`ปลูกตันตะเคียนทอง เนื่องใน วันต้นไม้แห่งชาติ`,
            image:"../assets/images/activity-3.jpg"
        },
        { 
            startDate:"12 เม.ย. 65",
            endDate:"" ,
            description :`สงกรานต์รดน้ำดำหัว`,
            image:"../assets/images/activity-4.jpg"
        }
    ])

    return(
    <div className="page">
        <div className="button-title" >
            กิจกรรม
        </div> 

        <div className="w-100" >
            {
                activities.map((act,inx)=>
                inx%2==0 ?  <div className={`card-activity ${inx%2==0?"left":"right"} grid grid-cols-3  `}  onClick={()=>{navigate("/activities/detail")}}>
                    <div className="act-img my-1 mx-1" style={{backgroundImage:`url('${act?.image}')`}} ></div>
                    <div className={`col-span-2 px-2 flex column justify-center`}>
                        <label className="date">{act?.startDate}</label>
                        <label className="description">{act?.description}</label>
                    </div>
                </div>:<div className={`card-activity ${inx%2==0?"left":"right"} grid grid-cols-3  `} onClick={()=>{navigate("/activities/detail")}} >
                    <div className={`col-span-2 px-2 flex column justify-center  items-end  `} style={{textAlign:"right"}}>
                        <label className="date">{act?.startDate}</label>
                        <label className="description">{act?.description}</label>
                    </div>
                    <div className="flex  justify-end items-end"> 
                       <div className="act-img col-span-1 my-1 mx-1" style={{backgroundImage:`url('${act?.image}')`}} ></div>
                    </div>
                    
                </div>
                )

            }
        </div>
    </div>
    )
}

export default Activities;