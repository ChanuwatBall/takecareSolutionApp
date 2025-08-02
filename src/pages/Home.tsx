import { useState } from "react";
import "./css/Home.css"
import   { SwiperSlide ,Swiper } from "swiper/react";
// import type { Swiper as SwiperType } from "swiper/types";

const Home:React.FC=()=>{

    const [executive,setExecutive] = useState({
        image:"../assets/images/executive-profile.png" ,
        nickname:"นายกตู่" ,
        firstName:"สุรพงษ์" ,
        lastName: "ประสารวุฒิ"
    })

    const [teamleft,setTeamLeft] = useState([
        "../assets/images/executive-team-left.jpg",
        "../assets/images/executive-team-left.jpg",
        "../assets/images/executive-team-left.jpg"
    ])
    const [teamright,setTeamRight] = useState([ 
        "../assets/images/executive-team-right.jpg",
        "../assets/images/executive-team-right.jpg",
        "../assets/images/executive-team-right.jpg"
    ])

    const [companyDetail , setCompanyDetail] = useState({
        name:"เทศบาลตำบลบางหมาก:" , subtitle:"ท้องถิ่นน่าอยู่ คู่พัฒนาชุมชนเมืองชุมพร" ,
        description:[
            `เทศบาลตำบลบางหมาก ตั้งอยู่ในพื้นที่ตำนลบามหมาก อำเทอเมืองรุมพร จึงหรัดรุงพร
            เป็นหน่วยงามปกครอง ส่วนก็องเห็นที่มีนทบากสำหรัญ ในการดูแลคคุณภาพเวัวิภาพย์วิตของ
            ประชาชนกว่า 12,000 คนในพื้นที่กว่า 13 หมู่บ้าน คือยการพัฒบาอย่างรอบคำต่างรอบคำน` ,
            `ด้วยวิสัยทักษ์ที่มุ่งมั่นสร้าง "ซุนฆ่าอยู่ ประชาชนมีลูก ทหบาลค่านสบางหมาามาใช้อิ่ม
            และเล็กคันโครงการหลากทลาม อาที โครสาร "ผู้สูงอายุสูงอายุสุทาพที่ 850" ที่ใช้ความรู้
            และดูแลกลุ่มผู้สูงวัยอย่างต่อเนื่อง รวมถึงการจัดกิจกรรมต้อนรับคณะกรรมการตรวจ
            ประเมินระดับจังหวัด เพื่อส่งเสริมบทบาทของชุมชนในการสร้างสรรค์พื้นที่ให้เกิดคุณภาพ
            และความภาคภูมิใจร่วมกัน`
        ]
    })

    return(
    <div className="page" style={{paddingTop:"0" }}>
        <div className="card-executive" >
            <div  className="name-container">  
                <label className="executive-nickname" > {executive?.nickname} </label> <br/>
                <label className="full-name" >{executive?.firstName}  {executive?.lastName}</label> 
            </div> 
            <img src={executive?.image} alt="executive-profile" />
        </div>
        <div className="card-executive-team  grid grid-cols-2 gap-2 ">
            <div className="executive-team" > 
                <Swiper
                    spaceBetween={5}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')} 
                    style={{width:"100%"}}
                >
                  <div  style={{ height:"fit-content" }} > 
                        {teamleft.map((url)=>
                        <SwiperSlide>  
                            <div className="team-profile" style={{backgroundImage: "url("+url+")" ,}} ></div> 
                        </SwiperSlide>
                        )}
                  </div>
                </Swiper>
                <div className="executive-team-name" > ทีม สท. </div>
                      
            </div>
            <div className="executive-team" > 
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')} 
                    style={{width:"100%"}}
                > 
                    {teamright.map((url)=>
                     <SwiperSlide style={{width:"100%"}}> 
                        <div className="team-profile"  style={{backgroundImage: "url("+url+")" ,  }} ></div>
                    </SwiperSlide>
                    )}
                </Swiper>
                <div className="executive-team-name" > ทีมบริหาร </div>
            </div>
        </div>
        <div className="card-team-description" >
            <h6> {companyDetail?.name} <br/> {companyDetail?.subtitle} </h6> 
            {companyDetail?.description.map((p)=><p>{p}</p> )}
            <p></p>
        </div>
    </div>
    )
}
export default Home;