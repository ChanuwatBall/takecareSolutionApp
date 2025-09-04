import { useNavigate, useParams } from "react-router-dom";
import PullToRefreshComponent from "../components/PullToRefreshComponent"
import { useEffect, useState } from "react";
import { complaintid, decodeBase64,  getStorage } from "../action"; 
import { LazyLoadImage } from 'react-lazy-load-image-component';
 

const apiUrl = import.meta.env.VITE_API;

interface Complaint {
    "id": number
    "phone": string
    "supTitle": string
    "detail": string
    "status": string
    "villager": number
    "topicId": number
    "topic": string
    "imageIds": string[]
    "admin":  string
    "point": string[]
}


const ComaplaintDetail=()=>{
    //@ts-ignore
    let L = window?.leaflet
    var map:any = null
    var marker:any = null
    const { complaintId }: any = useParams(); 
    const [comaplaint , setComplaints] = useState<Complaint | null>(null)
    const navigate = useNavigate()
    
    useEffect(()=>{
        const id = decodeBase64(complaintId) 
        const getComplaintDetail=async()=>{
            const member:any = await getStorage("member") 
            const complaint = await complaintid({body: member , id:id })
            setComplaints(complaint)
            if(complaint?.point){
                const latlng = [Number(complaint?.point[0]) , Number(complaint?.point[1]) ]
                createmap(latlng) 
            }
        }
        getComplaintDetail()
    }, [])

     const createmap=async (latlng: number[])=>{
        const mapel: Element | any = document.querySelector('#mapposition')
        console.log("mapel ", mapel)
        console.log("createmap latlng", latlng)
         if (mapel != null && mapel?.innerHTML.length < 1) {
                    map = L.map(mapel, {
                        center: latlng ,
                        zoom: 13 ,dragable : false
                    });
                    console.log("map ",map) ;
                    
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© Longdo Map' }).addTo(map);
                    // await userlocation()
                    
                    map?.invalidateSize()
                    setTimeout(()=>{
                        if (marker == null) {
                            marker = L.marker(latlng,{draggable:true}).bindPopup('จุดร้องเรียน');
                            map?.setView(latlng, 16)  
                            map?.addLayer(marker); 
                        }else{ 
                            marker?.setLatLng(latlng); 
                        }
                    },300)
 
                } 
    }


    return(
    <PullToRefreshComponent >
        <div id="page" className="page  " style={{ position: "relative" }} > <br/><br/>
           { comaplaint && <div>
                <h4 className="text-xl font-semibold text-gray-900 text-black ">
                    <button style={{padding:".5rem 1rem .5rem 1rem",background:"transparent"}} onClick={()=>{navigate(-1)}}> 
                      <small> <img src={apiUrl+"/images/svg/arrow-back.svg"}  style={{width:".5em"}}/> </small> 
                    </button>   ภาพรวมการแจ้งปัญหา
                </h4><br /> 
                    <div>
                        <div className="row-input " style={{ margin: "0px" }}>
                            <label className="title" >หัวข้อเรื่อง: </label>
                            <div className="input text-black" >
                                {comaplaint?.topic}
                            </div>
                        </div>

                        <div className="row-input row" style={{ margin: "0px" }} >
                            <label className="title" >หัวข้อเรื่องย่อย: </label>
                            <div className="input text-black" >
                                {comaplaint?.supTitle}
                            </div>
                        </div>
                        <div className="row-input row" style={{ margin: "0px" }}>
                            <label className="title" >เบอร์โทรที่สามารถติดต่อได้: </label>
                            <div className="input text-black" >
                                {comaplaint?.phone}
                            </div>
                        </div>

                        <div className=" row-input row " style={{ margin: "0px", flexDirection: "column", alignItems: "flex-start" }} >
                            <label className="title" >รายละเอียด: </label>
                            <label className="input text-black" > {comaplaint?.detail} </label>
                            
                        </div><br /> 
                        <div className="grid grid-cols-3 gap-4  ">
                            { comaplaint?.imageIds &&  comaplaint?.imageIds.map((image: any, index: any) =>
                                image && <div key={index} className="relative">
                                    {/* Image Display */}
                                    <LazyLoadImage
                                        src={apiUrl+"/api/file/drive-image/"+image}
                                        alt={`Image ${index}`}
                                        className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
                                    />
 
                                </div>
                            )}
                        </div> 
                    </div>
            </div>} <br/>
            <div id="mapposition"  style={{width:"100%" , height:"13rem",backgroundColor:"#eee",borderRadius:"10px", marginBottom:"5rem"}} ></div> <br/><br/>
        </div>
    </PullToRefreshComponent>

    )
}
export default ComaplaintDetail;

 