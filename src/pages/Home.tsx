import { useEffect, useState } from "react";
import "./css/Home.css"
import   { SwiperSlide ,Swiper } from "swiper/react";
import { isAuthenticated } from "../auth";  
import { companydetail, deleteCookie, getCookie, setCookie } from "../action";
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API;


const Home:React.FC=()=>{ 
    const [ceoname , setCeoName] = useState("")
    const [ceonickname , setceonickname] = useState("") 
    const [ceoImage,setCeoimages] = useState("")
    const [slogan , setSlogan] = useState("")
    const [history,setHistory] = useState([])
    const [comname , setComname] = useState("")
    const navigate = useNavigate()
    

    // const [executive] = useState({
    //     image:"../assets/images/executive-profile.png" ,
    //     nickname:"นายกตู่" ,
    //     firstName:"สุรพงษ์" ,
    //     lastName: "ประสารวุฒิ"
    // })

    const [teamleft, setTeamLeft] = useState([
        "../assets/images/executive-team-left.jpg",
        "../assets/images/executive-team-left.jpg",
        "../assets/images/executive-team-left.jpg"
    ])
    const [teamright, setTeamRight] = useState([ 
        "../assets/images/executive-team-right.jpg",
        "../assets/images/executive-team-right.jpg",
        "../assets/images/executive-team-right.jpg"
    ])

    // const [companyDetail ] = useState({
    //     name:"เทศบาลตำบลบางหมาก:" , subtitle:"ท้องถิ่นน่าอยู่ คู่พัฒนาชุมชนเมืองชุมพร" ,
    //     description:[
    //         `เทศบาลตำบลบางหมาก ตั้งอยู่ในพื้นที่ตำนลบามหมาก อำเทอเมืองรุมพร จึงหรัดรุงพร
    //         เป็นหน่วยงามปกครอง ส่วนก็องเห็นที่มีนทบากสำหรัญ ในการดูแลคคุณภาพเวัวิภาพย์วิตของ
    //         ประชาชนกว่า 12,000 คนในพื้นที่กว่า 13 หมู่บ้าน คือยการพัฒบาอย่างรอบคำต่างรอบคำน` ,
    //         `ด้วยวิสัยทักษ์ที่มุ่งมั่นสร้าง "ซุนฆ่าอยู่ ประชาชนมีลูก ทหบาลค่านสบางหมาามาใช้อิ่ม
    //         และเล็กคันโครงการหลากทลาม อาที โครสาร "ผู้สูงอายุสูงอายุสุทาพที่ 850" ที่ใช้ความรู้
    //         และดูแลกลุ่มผู้สูงวัยอย่างต่อเนื่อง รวมถึงการจัดกิจกรรมต้อนรับคณะกรรมการตรวจ
    //         ประเมินระดับจังหวัด เพื่อส่งเสริมบทบาทของชุมชนในการสร้างสรรค์พื้นที่ให้เกิดคุณภาพ
    //         และความภาคภูมิใจร่วมกัน`
    //     ]
    // })

    useEffect(()=>{
        const checkmemberregis=async ()=>{
            const profilecookie = await getCookie("profile")
            if(profilecookie === null || profilecookie === undefined){
                 const profile:any = await liff.getProfile()
                 setCookie("profile",profile,30) 
            }
        }
        checkmemberregis()
       if( isAuthenticated() ){
        //  navigate("/register")
         const getCDetal=async ()=>{
            const profile = await getCookie("profile")
            const result =await companydetail({  lineId: profile?.userId})
            console.log("companydetail result ",result)
            if(result?.name || result?.name){
                setCeoName(result?.ceoName)
                setceonickname(result?.ceoNickName)
                setHistory(result?.history)
                setSlogan(result?.slogan)
                setComname(result?.name)
                setTeamLeft(result?.teamMembers)
                setTeamRight(result?.managementTeam)
                setCeoimages(result?.ceoImage)
            }else{
                deleteCookie("member")
                deleteCookie("profile")
                localStorage.removeItem("token")
                
                navigate("/")
            }
         }
         getCDetal()
       }
    },[]) 

    return(
    <div className="page" style={{paddingTop:"0" }}>
        <div className="card-executive" >
            <div  className="name-container">  
                <label className="executive-nickname" > {ceonickname} </label> <br/>
                <label className="full-name" >{ceoname}</label> 
            </div> 
            <img src={apiUrl+"/api/file/drive-image/"+ceoImage} alt="executive-profile" />
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
                        {teamleft&&teamleft.map((url)=>
                        <SwiperSlide>  
                            <div className="team-profile" style={{backgroundImage: "url("+apiUrl+"/api/file/drive-image/"+url+")" ,}} ></div> 
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
                    {teamright&&teamright.map((url)=>
                     <SwiperSlide style={{width:"100%"}}> 
                        <div className="team-profile"  style={{backgroundImage: "url("+apiUrl+"/api/file/drive-image/"+url+")" ,  }} ></div>
                    </SwiperSlide>
                    )}
                </Swiper>
                <div className="executive-team-name" > ทีมบริหาร </div>
            </div>
        </div>
        <div className="card-team-description" >
            <h6> {comname} <br/> {slogan} </h6> 
            {history&&history.map((p)=><p>{p}</p> )}
            <p></p>
        </div>
    </div>
    )
}
export default Home;