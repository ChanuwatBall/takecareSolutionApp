import { useState } from "react"
import "./css/Activities.css"

const ActivitieDetail=()=>{
    const [activity , setActivity] = useState({ 
            startDate:"24-28 เม.ย. 67",
            endDate:"" ,
            description :`ไทยทรงดำ หรือ ไทค่า เป็นกลุ่มชาติพพันธุ์ที่มีที่มีที่นท่าเนิดจากเกล้นสองจ่าย (เมืองแกง
ทางตอนหมือของอียคนาม อพยพเข้ามาในประทศไทยทั้งแผ่สมัยกรุงขงธนบุรี กระจายตั้ง
ถิ่นฐานในหลายจังหวัด เช่น เพชรบุรี สุพรรณบุรี และสระบุรี มีเอกลักษณ์โดดเด่นด้านการ
แต่งทานด้อยชุดสีดำ สถาปีตยกรรมบ้านบ้านได้ถนลุงกรงกระคองเละวิถีความเรื่องเชื่อเรื่องมี
บรรพบุรุษ มีเรือนและมีเมือง โดยมีประพาพที่เดิม เช่น งานอื่นก่อนพี่จนเทน และการ
สืบทอดวัฒนธรรรมผ่านศูนย์เรียนรู้ในชุมชนต่างๆ อย่างกันแข็ง.`,
            image:"../assets/images/activity-1.jpg" ,
            cover: "../assets/images/activity-cover-1.jpg" ,
            coverTitle:`ขอเชิญร่วมงานประเพณีไทยทรงดำ ณ วัดดอนรวบ โครงการผู้สูงอายุสุขภาพดี ชีวีมีสุข ครั้งที่ 1` ,
            location:"วัดดอน"

   })
     

    return(
    <div className="page mb-6">   
        <div className="button-title" >
            กิจกรรม
        </div> 

        <div className="card-activity p-0 "  >
            <img src={activity?.cover} alt="activity-cover" className="w-100"   />
            <br/>
            <h5>{activity?.coverTitle}</h5>
            <p>{activity?.description}</p>

            <div className="  grid  grid-cols-2 my-3 mt-5" >
                <div className="flex items-center justify-center" >
                    <button className="bg-hilight  detail-hilight "  >สถานที่จัด {activity?.location}</button>
                </div>
                <div className="flex items-center justify-center" >
                     <button  className="bg-hilight detail-hilight " >วันที่ {activity?.startDate}</button>
                </div>
            </div>
        </div>


    </div>
    )
}

export default ActivitieDetail;