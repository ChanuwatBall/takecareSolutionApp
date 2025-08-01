


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper ,SwiperSlide } from 'swiper/react';  
  
import "./css/Complaint.css"
import "./css/ComplaintForm.css" 
//@ts-ignore
import 'swiper/css';      
import type { Swiper as SwiperType } from "swiper/types";
// import L from "leaflet"


//@ts-ignore
let L = window?.leaflet
 var map:any = null
const ComplaintForm=()=>{
    const [topic,setTopic] = useState("")
    const navigate = useNavigate();
    const [swiperref , setSwiperRef ] = useState<SwiperType|any>(null)

    const userlocation=async()=>{
       const location=await map?.locate({setView: true })
        .on('locationfound', function(e:any){
            var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
            map.setView([e.latitude, e.longitude],16)
            // var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
            //     weight: 1,
            //     color: 'blue',
            //     fillColor: '#cacaca',
            //     fillOpacity: 0.2
            // });
            map.addLayer(marker);
            // map.addLayer(circle);
        })
       .on('locationerror', function(e:any){
            console.log(e);
            alert("Location access denied.");
        });
       console.log("location ",location)
    }

    return(
        <div className="page  " >
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
            <Swiper
            spaceBetween={5}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) =>{setSwiperRef(swiper); console.log(swiper)}}
            style={{width:"100%"}}
            >
                <SwiperSlide style={{width:"100%"}}>
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
                        <div className="row-input flex row " >
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
                            <button className="next" onClick={()=>{swiperref?.slideNext() }} >
                                <label>ถัดไป</label>
                            </button>
                        </div>
                     
                </SwiperSlide>
                <SwiperSlide>
                    <MapPosition />
                    <button className="find-my-loaction" onClick={()=>{userlocation()}} >
                        <img src="../assets/images/pin-locatiion.png" />
                         ตำแหน่งของฉัน
                    </button>
                    <div className="row-input "  >
                        <button className="back" onClick={()=>{swiperref?.slidePrev() }} >
                            <label>ย้อนกลับ</label>
                        </button>
                        <button className="next" onClick={()=>{swiperref?.slideNext() }} >
                            <label>ถัดไป</label>
                        </button>
                    </div>
                </SwiperSlide>  
            </Swiper>
        </div>
            
 

        </div>
    )
}

export default ComplaintForm;

const MapPosition=()=>{
    useEffect(()=>{ 
        console.log("lmap ",L)
        createMap()
    },[])

    const createMap=()=>{
        const mapel: Element | any = document.querySelector('#mapposition')
            console.log("mapel ",mapel.innerHTML)
        if(mapel != null && mapel?.innerHTML.length < 1){
            map = L.map(mapel, {
                center: [51.505, -0.09],
                zoom: 13
            });
            console.log("map ",map)
            L.tileLayer('https://longdomap.attg.cc/mmmap/img.php?zoom={z}&x={x}&y={y}', {  attribution: '© Longdo Map'}).addTo(map);
        }
    }


    return(
    <div id="mapposition"  >
                    
    </div>)
}