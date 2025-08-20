


import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper ,SwiperSlide } from 'swiper/react';  
import { Camera, CameraResultType, CameraSource, type GalleryPhotos } from '@capacitor/camera';
 
// import {type Marker as MarkerType }from "leaflet"

import "./css/Complaint.css"
import "./css/ComplaintForm.css" 
//@ts-ignore
import 'swiper/css';      
import type { Swiper as SwiperType } from "swiper/types";
import { useAlert } from "../components/AlertContext";
import { createComplaint, getCookie, villageuser } from "../action";
import {Geolocation} from "@capacitor/geolocation"
// import liff from "@line/liff"; 

import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { BouceAnimation } from "../components/Animations";
import { headersize } from "../components/PageHeader";
import { areaInputToFeature, isLatLonInsideGeoJSON } from "../utils/geo-contains";
import { useDispatch } from "react-redux";
import { setLoaing } from "../store/appSlice";
// import L from "leaflet"
const apiUrl = import.meta.env.VITE_API;




//@ts-ignore
let L = window?.leaflet
var map:any = null
let marker:  any = null
let villagePoly:  any = null
let village :  any = null

const ComplaintForm=()=>{
    const [showAlert] = useAlert();
    // const { type } = useParams<{ type: string  }>();
    const [topic,setTopic] = useState<any>("")
    const [subtitle,setSupTitle] = useState<any>("")
    const [phone,setPhone] = useState<any>("")
    const [detail,setDetail] = useState<any>("")
    const [images , setImages] = useState<any[]>([])
    const [complainTopic, setComplainTopic] = useState<any>("")
    const maxLengthImage = 5;
    const [curlocation , setCurLocation] = useState<any>(null) 
    const [isInSide , setIsInSide] = useState(true)
    const dispatch = useDispatch()
   
    const location = useLocation();  
    const comaplaintmenu =  location.state?.complaintmenu
    

    const navigate = useNavigate();
    const [swiperref , setSwiperRef ] = useState<SwiperType|any>(null)
    const [ openmodal ,setOpen] = useState(false)

    const userlocation=async()=>{
        await Geolocation.getCurrentPosition({enableHighAccuracy:true}).then((e) =>{
            console.log("coord ", e?.coords)
            if(e.coords){
                setCurLocation(e.coords)
                if(marker==null){ 
                    marker = L.marker([e.coords.latitude, e.coords.longitude]).bindPopup('ตำแหน่งของคุณ)');
                    map?.setView([e.coords.latitude, e.coords.longitude],16)
                
                    map?.addLayer(marker);
                }else{
                    marker?.setLatLng([e.coords.latitude, e.coords.longitude],16);
                }

                const feature = areaInputToFeature(village);
                const inside = isLatLonInsideGeoJSON(e.coords.latitude, e.coords.longitude, feature);
                setIsInSide(inside)
                if(!inside){
                    showAlert("ไม่สามารถแจ้งปัญหา ท่านอยู่นอกพื้นที่ร้องเรียน ","error")
                }
            }
        }) 
    }

    useEffect(()=>{  
        headersize()
        setTopic( comaplaintmenu?.label)
        setComplainTopic( comaplaintmenu?.value) 

    },[])

    const confirmComplaint=()=>{ 
        setOpen(true) 
    }

    const isInLINE = () => / line\//i.test(navigator.userAgent); 
    const fileRef = useRef<HTMLInputElement>(null);
    const takePicture = async () => { 
        if (images?.length >= maxLengthImage) return; 
         
           try {   
            const perm = await Camera.checkPermissions();
            if (perm.camera === "denied") {
             await Camera.requestPermissions();
              await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
                audio: false,
                });

            }

            const image = await Camera.getPhoto({
            quality: 70,
            resultType: CameraResultType.Uri, // หรือ DataUrl ถ้าจะเก็บเป็น base64
            allowEditing: false,
            // เวิร์กดีบน web ส่วนใหญ่
            source: CameraSource.Prompt, // ให้ระบบถาม: กล้อง/แกลเลอรี
            // webUseInput: true,           // บนเว็บจะ fallback เป็น file input
            });

            setImages([...(images || []), image]);
        } catch (err) {
            console.log("Camera error", err);
            // fallback: เปิด input ธรรมดา
            fileRef.current?.click();
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
            showAlert("โปรดกรอกข้อมูลให้ครบถ้วน !!","warning")
         }else{
         swiperref?.slideNext()
         }
    }

    const blobUrlToFile = async (blobUrl: string, filename: string): Promise<File> => {
        const response = await fetch(blobUrl);  // Fetch the blob data
        const blob = await response.blob();     // Get the blob from the response
        const file = new File([blob], filename, { type: blob.type }); // Convert blob to file
        return file;
    };


    const acceptform=async ()=>{
        setOpen(false)
        if(isInSide){ 
            dispatch(setLoaing(true))
            const formData = new FormData();
            const villager:any = await getCookie("member")
            console.log("villager ",villager)
            let files: any[] = []
            await Promise.all ( await images.map( async (e,index)=>{
                const img = await  blobUrlToFile(e.webPath, `complaint-img${index}.${e.format}`)
                files = [...files , img]
                formData.append('files',img);
            })
            )
            // const line = await liff.getProfile() 
            const line:any = await getCookie("profile")
            formData.append('curlocation',curlocation);
            formData.append('topic',topic);
            formData.append('subtitle',subtitle);
            formData.append('phone',phone);
            formData.append('detail',detail);
            formData.append('complainTopic',complainTopic);
            formData.append('villagerId',villager?.id);
            formData.append('villageId',  villager?.villageId );
            formData.append('lineId',  line?.userId );


            // console.log("form ",form) 
            const result = await createComplaint(formData)

            dispatch(setLoaing(false))
            // setLoading(false)
            if(result?.result ){ 
                showAlert(result?.description+" สามรถติดตามสถานะเรื่องร้องเรียนได้ที่หน้าโปรไฟล์ของท่าน ","success")
                navigate(-1)
            }else{
                showAlert(result?.description,"error")
            }
        }
    }

    const removeimage=(e:any)=>{
        console.log(" remove images ",e)
        images.splice(e?.index, 1);
        let filteredArray = images.filter((item) => item !== e.image )
       
        setImages(filteredArray)
    }

   const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;  
        const fileurl =  URL.createObjectURL(file) 
         
        const addimg = [...images ,{webPath: fileurl , format:"jpeg"} ]  
        setImages(addimg)  
    };

    return(
    <PullToRefreshComponent > 
        <div  id="page" className="page  " style={{position:"relative"}} >
       
          {/* {preview && <img src={preview} alt="preview" style={{maxWidth:"100%"}} />} */}
        <ModalDialog 
         open={openmodal} setOpen={(e:any)=>{setOpen(e)}}
         complaint={ {topic, subtitle , phone, detail, images} }
         acceptform={acceptform}
         removeImage={(e:any)=>{removeimage(e)}}
        />
        
        <BouceAnimation duration={0.1}> 
        <div className="title-row set-row" style={{flexDirection:"row-reverse"}} >
            <div className="complaint-button-title" style={{justifyContent:"center"}}> 
                <label>รับเรื่องร้องทุกข์</label>
            </div> 
            <BouceAnimation duration={0.5}> 
               <div className="topleft-continue-complaint-menu" >  </div>
            </BouceAnimation>
        </div> 
        </BouceAnimation>
       <BouceAnimation duration={0.3}> 
          <div  className="complaints-menu" >  
            <Swiper
            draggable={false}
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
                                <input 
                                    placeholder="09 0000000" 
                                    value={phone} maxLength={10} 
                                    onFocus={()=>{phone.length === 0 &&  setPhone("0") }}
                                    onChange={(e)=>{setPhone(e.target.value)}}>
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
                            {/iPhone|iPad|iPod/i.test(navigator.userAgent) && isInLINE() ? <div style={{ position: "relative", display: "inline-block" }}>
                                    <button type="button" style={{ padding: 0, border: "none", background: "transparent" }}>
                                        <img src={apiUrl + "/images/camera.png"} alt="" />
                                        <div>ถ่ายรูป</div>
                                    </button>

                                    {/* input ซ้อนทับปุ่ม (ห้าม display:none) */}
                                    <input
                                    ref={fileRef}
                                    id="cam"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={onFileChange}
                                    style={{
                                        position: "absolute",
                                        inset: 0,           // ครอบเต็มปุ่ม
                                        opacity: 0,         // โปร่งใส
                                        cursor: "pointer",
                                        zIndex: 20,
                                        // บาง iOS ต้องการขนาดคลิกที่ชัดเจน
                                        width: "100%",
                                        height: "100%",
                                        // กัน iOS ปรับ zoom ตอนโฟกัส
                                        fontSize: 16
                                    }}
                                    />
                             </div>:  <button onClick={()=>{takePicture()}} >
                                <img src={apiUrl+"/images/camera.png"}  />
                                <label>ถ่ายรูป</label>
                            </button>}
                          
                            
                            <button onClick={()=>{pickImages()}} >
                                <img src={apiUrl+"/images/picture.png"}  />
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
                    <BouceAnimation duration={0.3}>
                        <MapPosition  />
                    </BouceAnimation>
                    <BouceAnimation duration={0.4}>
                        <button className="find-my-loaction" onClick={()=>{userlocation()}} >
                            <img src={apiUrl+"/images/pin-locatiion.png"} />
                            ตำแหน่งของฉัน
                        </button>
                    </BouceAnimation>
                    <BouceAnimation duration={0.5}>
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
                    </BouceAnimation>
                </SwiperSlide>  
            </Swiper>
        </div>
        </BouceAnimation>  
    </div>
    </PullToRefreshComponent>
    )
}

export default ComplaintForm;

const MapPosition=()=>{
    useEffect(()=>{  
        createMap()
    },[])

    const createMap=async ()=>{
         await Geolocation.getCurrentPosition({enableHighAccuracy:true}).then(async (e) =>{
            console.log("coord ", e?.coords)
            if(e.coords){
                 const mapel: Element | any = document.querySelector('#mapposition') 
                if(mapel != null && mapel?.innerHTML.length < 1){
                    map = L.map(mapel, {
                        center: [ e?.coords?.latitude,  e?.coords?.longitude],
                        zoom: 13
                    }); 
                    //  var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
                    await map?.locate({setView: true })
                        .on('locationfound', function(e:any){
                            map.setView([e.latitude, e.longitude],16)
                        })
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {  attribution: '© Longdo Map'}).addTo(map);
                

                       
                    const profile:any = await getCookie("profile") 
                    village = await villageuser({lineId:profile?.userId})
                 
                    villagePoly = await createAreaLayer(village) 
                    villagePoly.addTo(map);

                    const bounds = (villagePoly as any).getBounds?.();
                    if (bounds && bounds.isValid()) {
                        map.fitBounds(bounds.pad(0.1));
                    }
                }
            }
         })
       
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


async function createAreaLayer(
  data: any,
  options?: L.GeoJSONOptions
): Promise<L.GeoJSON> {
  // 1) แปลง [lat, lng] -> [lng, lat] ตามสเปค GeoJSON
  const ring: [number, number][] = data.area.map(([lat, lng]:any) => [lng, lat]);

  // 2) ปิดรูปรอบ polygon ถ้าจุดสุดท้ายไม่เท่าจุดแรก
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (!first || !last) {
    throw new Error("area is empty");
  }
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  // 3) สร้าง GeoJSON Feature (Polygon)
  const feature: GeoJSON.Feature<GeoJSON.Polygon, { id: number; name: string }> = {
    type: "Feature",
    properties: { id: data.id, name: data.name },
    geometry: {
      type: "Polygon",
      coordinates: [ring], // Polygon ต้องเป็น array ของ "linear ring"
    },
  };

  // 4) สร้าง Leaflet GeoJSON Layer
  const layer = L.geoJSON(feature, {
    // style เริ่มต้น (แก้ได้ผ่าน options)
    style: () => ({
      color: "#1976d2",
      weight: 2,
      fillColor: "#1976d2",
      fillOpacity: 0.2,
    }),
    onEachFeature: (_f:any, lyr:any) => {
      lyr.bindPopup(`<b>${data.name}</b>`);
    },
    ...options,
  });

  return   layer;
}