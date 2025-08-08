


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper ,SwiperSlide } from 'swiper/react';  
import { Camera, CameraResultType, type GalleryPhotos, type Photo } from '@capacitor/camera';


import "./css/Complaint.css"
import "./css/ComplaintForm.css" 
//@ts-ignore
import 'swiper/css';      
import type { Swiper as SwiperType } from "swiper/types";
import { useAlert } from "../components/AlertContext";
// import L from "leaflet"


//@ts-ignore
let L = window?.leaflet
 var map:any = null
const ComplaintForm=()=>{
    const [showAlert] = useAlert();
    const { type , title } = useParams<{ type: string , title:string}>();
    const [topic,setTopic] = useState<any>("")
    const [subtitle,setSupTitle] = useState<any>("")
    const [phone,setPhone] = useState<any>("")
    const [detail,setDetail] = useState<any>("")
    const [images , setImages] = useState<any[]>([])
    const [complainTopic, setComplainTopic] = useState<any>("")
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

    useEffect(()=>{ 
        setTopic(title)
        setComplainTopic(type)
    },[])

    const confirmComplaint=()=>{ 
        setOpen(true) 
    }


    const takePicture = async () => {
        if(images?.length < maxLengthImage){
            try { 
                const image:Photo = await Camera.getPhoto({
                    quality: 70,
                    allowEditing: true,
                    resultType: CameraResultType.Uri
                }).then(e =>{
                    console.log(" image ", e)
                    return e
                }).catch(err=>{
                    console.log(" err",err)
                    return err
                })
     
                // let imageUrl = image.webPath; 
                const addimg = [...images ,  image ] 
                console.log("addimg ",addimg)
                setImages(addimg)
            
            } catch (error) {
               console.log("err ", error) 
            }
        }else{

        }
    };

    const pickImages=async ()=>{
        try { 
            if(images.length < maxLengthImage){
                const image:GalleryPhotos    = await Camera.pickImages({
                    quality: 70,  
                    presentationStyle: 'fullscreen' ,
                    limit: maxLengthImage - images.length
                }).then(e =>{
                    console.log(" image ", e)
                    return e
                }).catch(err=>{
                    console.log(" err",err)
                    return err
                })
                let imageUrl:any[] = []
                image?.photos.map((p)=>{
                    imageUrl = [...imageUrl , p]
                })  
                console.log("addimg ",imageUrl)
                 
                const imagesall =[...images , imageUrl ]
                const flatimg = imagesall.flat() 
                console.log("flatimg ",flatimg)
                setImages(flatimg  )
            }
        } catch (error) {
            console.log("err ",error)
        }
    }

    function continueform(){
         if(
            !subtitle || !phone || !detail || images.length === 0
         ){
            showAlert("โปรดกรอกข้อมูลให้ครบถ้วน !!")
         }else{
         swiperref?.slideNext()
         }
    }

    const acceptform=()=>{
        setOpen(false)

        const form ={
            topic , subtitle , phone , detail ,images ,complainTopic
        } 
        console.log("form ",form)
    }

    const removeimage=(e:any)=>{
        console.log(" remove images ",e)
        images.splice(e?.index, 1);
        let filteredArray = images.filter((item) => item !== e.image )
       
        setImages(filteredArray)
    }

    return(
        <div className="page  " style={{position:"relative"}} >
        {/* {openmodal && <div className="backdrop"></div> } */}
        <ModalDialog 
         open={openmodal} setOpen={(e:any)=>{setOpen(e)}}
         complaint={ {topic, subtitle , phone, detail, images} }
         acceptform={acceptform}
         removeImage={(e:any)=>{removeimage(e)}}
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
                                <input 
                                placeholder="โปรดระบุ" value={subtitle} 
                                onChange={(e)=>{setSupTitle(e.target.value)}}>
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
                                <img src="assets/images/camera.png"  />
                                <label>ถ่ายรูป</label>
                            </button>
                            
                            <button onClick={()=>{pickImages()}} >
                                <img src="assets/images/picture.png"  />
                                <label>แนบรูป</label>
                            </button>
                        </div>
                        <div className="row-input "  >
                            <button className="back" onClick={()=>{navigate(-1)}} >
                                <label>ย้อนกลับ</label>
                            </button>
                            <button className="next" onClick={()=>{continueform(); }} >
                                <label>ถัดไป</label>
                            </button>
                        </div>
                     
                </SwiperSlide>
                <SwiperSlide>
                    <MapPosition />
                    <button className="find-my-loaction" onClick={()=>{userlocation()}} >
                        <img src="assets/images/pin-locatiion.png" />
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


const ModalDialog=({open,setOpen ,complaint,acceptform ,removeImage} :any)=>{
    useEffect(()=>{ 
        console.log("complaint  ",complaint)
    },[])
    return(
    open && <div  className="backdrop flex " style={{ justifyContent:"center", alignItems:"center"}}
      >
        <div className=" flex items-center justify-between p-4 md:p-5 border-b rounded-t   dark:border-gray-600 border-gray-200" > 
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700" style={{minHeight:"70vh",width:"90vw",padding:"1rem"}}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                 ภาพรวมการแจ้งปัญหา
             </h3><br/>

             <div>
                <div className="row-input " style={{margin:"0px"}}>
                    <label className="title" >หัวข้อเรื่อง: </label>
                    <div className="input" >
                        {complaint?.topic}
                    </div>
                </div>

                <div className="row-input row"  style={{margin:"0px"}} >
                    <label className="title" >หัวข้อเรื่องย่อย: </label>
                     <div className="input" >
                        {complaint?.subtitle}
                    </div>
                </div>
                <div className="row-input row"  style={{margin:"0px"}}>
                    <label className="title" >เบอร์โทรที่สามารถติดต่อได้: </label>
                     <div className="input" >
                        {complaint?.phone}
                    </div>
                </div><br/>
                <div className=" p-4 md:p-5 border-t border-gray-200 " ></div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {complaint?.images.map((image:any,index:any)=>
                     image && <div key={index} className="relative">
                        {/* Image Display */}
                        <img
                            src={image.webPath}
                            alt={`Image ${index}`}
                            className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
                        />

                        {/* Delete Button */}
                        <button
                            onClick={() => removeImage(image, index)} style={{padding:"3px 5px 3px  5px"}}
                            className="absolute top-2 right-2 bg-red-500 text-black rounded-full text-sm hover:bg-red-700 transition duration-200"
                        >
                            X
                        </button>
                        </div>
                    )} 
                </div>
              
             </div>
 
            <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button  
                type="button" 
                onClick={()=>{setOpen(false)}}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    ยกเลิก
                </button>
                <button   
                type="button" 
                onClick={()=>{acceptform()}} 
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    ตกลง
                </button>
            </div>
            </div>
        </div>
     </div>  
    )
}