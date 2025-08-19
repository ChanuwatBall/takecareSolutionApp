import { useEffect, useState } from "react";
import "./css/Home.css"
import   { SwiperSlide ,Swiper } from "swiper/react"; 
import { companydetail, deleteCookie, getCookie } from "../action"; 
import { useNavigate } from "react-router-dom";
import { BouceAnimation  } from "../components/Animations"; 
import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { headersize } from "../components/PageHeader";
import { useDispatch } from "react-redux";
import { setLoaing } from "../store/appSlice";

const apiUrl = import.meta.env.VITE_API;
 

const Home:React.FC=()=>{ 
    const dispatch = useDispatch()
    const [ceoname , setCeoName] = useState("")
    const [ceonickname , setceonickname] = useState("") 
    const [ceoImage,setCeoimages] = useState("")
    const [slogan , setSlogan] = useState("")
    const [history,setHistory] = useState([])
    const [comname , setComname] = useState("")
    const navigate = useNavigate()
     

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
 

    useEffect(()=>{
        headersize()
        dispatch(setLoaing(true))
         const getCDetal=async ()=>{
            try {
                const profile:any = await getCookie("profile")  
                if(profile != null && profile != undefined){

                    const result =await companydetail({  lineId: profile?.userId})
                
                    if(result?.name){
                        setCeoName(result?.ceoName)
                        setceonickname(result?.ceoNickName)
                        setHistory(result?.history)
                        setSlogan(result?.slogan)
                        setComname(result?.name)
                        setTeamLeft(result?.teamMembers)
                        setTeamRight(result?.managementTeam)
                        setCeoimages(result?.ceoImage)
                    }else{
                        alert("profile no profile " )
                        deleteCookie("member")
                        deleteCookie("profile")
                        localStorage.removeItem("token")
                         
                        window.location.reload()
                    }
                }else{ 
                        navigate("/") 
                    }
            } catch (error) {
                
                alert("error "+ JSON.stringify(error))
            }
            
            }
         getCDetal() 
         setTimeout(()=>{ 
            dispatch(setLoaing(false))
        },2000) 
         

    },[]) 

    return(    
    <PullToRefreshComponent > 
    <div id="page" className="page" style={{paddingTop:"0" }}> <br/> 
        <BouceAnimation duration={0.1} className="card-executive" > 
            <div  className="name-container">  
                <label className="executive-nickname" > {ceonickname} </label> <br/>
                <label className="full-name" >{ceoname}</label> 
            </div> 
            <img src={apiUrl+"/api/file/drive-image/"+ceoImage} className="executive-profile" alt="executive-profile" /> 
        </BouceAnimation>
        <BouceAnimation duration={0.4}> 
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
        </BouceAnimation>
        <BouceAnimation duration={0.3}>
        <div className="card-team-description" >
            <h6> {comname} <br/> {slogan} </h6> 
            {history&&history.map((p,i)=><p key={i} >{p}</p> )}
            <p></p>
        </div>
        </BouceAnimation>
    </div> 
    </PullToRefreshComponent>
    )
}
export default Home;

