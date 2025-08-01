


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper ,SwiperSlide } from 'swiper/react';  
import { Camera, CameraResultType, type GalleryPhotos, type Photo } from '@capacitor/camera';


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
    const [subtitle,setSupTitle] = useState("")
    const [phone,setPhone] = useState("")
    const [detail,setDetail] = useState("")
    const [images , setImages] = useState<any[]>([])
    const maxLengthImage = 5;

    const navigate = useNavigate();
    const [swiperref , setSwiperRef ] = useState<SwiperType|any>(null)
    const [ openmodal ,setOpen] = useState(false)

    const userlocation=async()=>{
       const location=await map?.locate({setView: true })
        .on('locationfound', function(e:any){
            var marker = L.marker([e.latitude, e.longitude]).bindPopup('ตำแหน่งของคุณ)');
            map.setView([e.latitude, e.longitude],16)
           
            map.addLayer(marker);
            // map.addLayer(circle);
        })
       .on('locationerror', function(e:any){
            console.log(e);
            alert("Location access denied.");
        });
       console.log("location ",location)
    }

    const confirmComplaint=()=>{
        // navigate("/complaint")
        setOpen(true)

    }


    const takePicture = async () => {
        if(images.length < maxLengthImage){
            const image:Photo = await Camera.getPhoto({
                quality: 70,
                allowEditing: true,
                resultType: CameraResultType.Uri
            });

            // image.webPath will contain a path that can be set as an image src.
            // You can access the original file using image.path, which can be
            // passed to the Filesystem API to read the raw data of the image,
            // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
            let imageUrl = image.webPath;
            console.log("imageUrl ",imageUrl)
            setImages([images ,  imageUrl ])
            // Can be set to the src of an image now
            // imageElement.src = imageUrl;
        }else{

        }
    };

    const pickImages=async ()=>{
         if(images.length < maxLengthImage){
            const image:GalleryPhotos    = await Camera.pickImages({
                quality: 70,  
                presentationStyle: 'fullscreen' ,
                limit: maxLengthImage - images.length
            })
            let imageUrl:any[] = []
            image?.photos.map((p)=>{
                imageUrl = [...imageUrl , p?.webPath]
            }) 
            console.log("imageUrl ",imageUrl)
            setImages( [...images , ...imageUrl ]  )
        }
    }

    return(
        <div className="page  " style={{position:"relative"}} >
        {/* {openmodal && <div className="backdrop"></div> } */}
        <ModalDialog 
         open={openmodal} setOpen={(e:any)=>{setOpen(e)}}
         complaint={ {topic, subtitle , phone, detail, images} }
        />
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
                                <input placeholder="หัวข้อเรื่อง" value={topic} onChange={(e)=>{setTopic(e.target.value)}}>
                                </input>
                            </div>
                        </div>
                        <div className="row-input flex column " style={{alignItems:"flex-start"}} >
                            <label className="title" >หัวข้อเรื่องย่อย* </label>
                            <div className="input" >
                                <input placeholder="โปรดเลือก" value={subtitle} onChange={(e)=>{setSupTitle(e.target.value)}}>
                                </input>
                            </div>
                        </div>
                        <div className="row-input row" >
                            <label className="title" >เบอร์โทรที่สามารถติดต่อได้: </label>
                            <div className="input" >
                                <input placeholder="090-000-000" value={phone} onChange={(e)=>{setPhone(e.target.value)}}>
                                </input>
                            </div>
                        </div>

                        <div className="row-input flex column " style={{alignItems:"flex-start"}} >
                            <label className="title" >รายละเอียด (ระบุชื่อซอย,ถนน) </label>
                            <div className="input" >
                                <textarea  value={detail} onChange={(e)=>{setDetail(e.target.value)}}>
                                </textarea>
                            </div>
                        </div>
                        <div className="row-input flex row " >
                            <label className="title" > 
                                แนบรูป (ไม่เกิน 5 รูป) <span><br/>อัพโหลดแล้ว&nbsp; {images.length}/{maxLengthImage} </span>
                                
                            </label>
                            <button onClick={()=>{takePicture()}} >
                                <img src="../assets/images/camera.png"  />
                                <label>ถ่ายรูป</label>
                            </button>
                            
                            <button onClick={()=>{pickImages()}} >
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
                        <button className="next"  type="button"
                        data-dialog-target="modal"
                        onClick={()=>{confirmComplaint()}} >
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
        createMap()
    },[])

    const createMap=async ()=>{
        const mapel: Element | any = document.querySelector('#mapposition') 
        if(mapel != null && mapel?.innerHTML.length < 1){
            map = L.map(mapel, {
                center: [51.505, -0.09],
                zoom: 13
            }); 
            //  var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
            await map?.locate({setView: true })
                .on('locationfound', function(e:any){
                    map.setView([e.latitude, e.longitude],16)
                })
            L.tileLayer('https://longdomap.attg.cc/mmmap/img.php?zoom={z}&x={x}&y={y}', {  attribution: '© Longdo Map'}).addTo(map);
        }
    }


    return(
    <div id="mapposition"  >
                    
    </div>)
}


const ModalDialog=({open,setOpen ,complaint} :any)=>{
    useEffect(()=>{ 
        console.log("complaint  ",complaint)
    },[])
    return(
    open && <div  className="backdrop flex " style={{ justifyContent:"center", alignItems:"center"}}
      >
        <div className=" flex items-center justify-between p-4 md:p-5 border-b rounded-t   dark:border-gray-600 border-gray-200" > 
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700" style={{minHeight:"70vh",width:"90vw",padding:"1rem"}}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                 Static modal
             </h3>

             <div>
                <div className="row-input row" >
                    <label className="title" >หัวข้อเรื่อง: </label>
                    <div className="input" >
                        {complaint?.topic}
                    </div>
                </div>

                <div className="row-input row" >
                    <label className="title" >หัวข้อเรื่องย่อย: </label>
                     <div className="input" >
                        {complaint?.subtitle}
                    </div>
                </div>
                <div className="row-input row" >
                    <label className="title" >เบอร์โทรที่สามารถติดต่อได้: </label>
                     <div className="input" >
                        {complaint?.phone}
                    </div>
                </div>
                <div className=" p-4 md:p-5 border-t border-gray-200 " ></div>
                <div className="columns-3 ">
                    {complaint?.images.map((e:any)=>
                     e && <img className="aspect-3/2" src={e} />
                    )} 
                </div>
              
             </div>
 
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button   
                type="button" 
                onClick={()=>{setOpen(false)}}className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    I accept
                </button>
                <button  
                type="button" 
                onClick={()=>{setOpen(false)}}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Decline
                </button>
            </div>
            </div>
        </div>
     </div>  
    )
}