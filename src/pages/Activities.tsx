import { useEffect, useState } from "react";
import "./css/Activities.css"
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";
import { activity } from "../action";
const apiUrl = import.meta.env.VITE_API;



const Activities=()=>{
     const navigate = useNavigate();
    const [activities ,setActivities] = useState([
        {
            "id": 1,
            dateActivity : "21-23 ก.ค. 68",
            "name": "งานประเพณีไทยทรงดำ",
            "shortName": "vfdvfv",
            "description": "cvrevrevr",
            "coverImagePath": "1GBvEhk7a9G9AXcjFo8S0eHTqLAjA12r6",
            "startDate": "2025-07-21",
            "endDate": "2025-07-23",
            "draft": false,
            "enable": true,
            "imagePaths": [
                "1VWH16d0WKcXGQCQLcNeoa5ozDNV3zYep",
                "1VWH16d0WKcXGQCQLcNeoa5ozDNV3zYep",
                "1F6MB-ZR0K33DhxtY3-vXYNFBAjiN5iKG"
            ]
        } 
    ])

    useEffect(()=>{
        const getactivities=async()=>{
            const profile:any = await liff.getProfile() 
            // const usr = await userLineid(profile?.userId)
            const result = await activity({lineId:profile?.userId})
            console.log("result ",result)
            setActivities(result)
        }
        getactivities()
    },[])

    return(
    <div className="page">
        <div className="button-title" >
            กิจกรรม
        </div> 

        <div className="w-100 pb-9" >
            {
                activities.map((act,inx)=>
                inx%2==0 ?  <div  
                    className={`card-activity ${inx%2==0?"left":"right"} grid grid-cols-3  `}  style={{ height:"9rem"}} 
                    onClick={()=>{navigate("/activities/detail", { state: { activity: act } })}}>
                    <div><div className="act-img my-1 mx-1" style={{backgroundImage:`url(${apiUrl}/api/file/drive-image/${act?.coverImagePath})`}} ></div>
                    </div>
                    <div className={`col-span-2 px-2 pl-3 flex column justify-center`}>
                        <label className="date">{act?.dateActivity}</label>
                        <label className="description">{act?.name}</label>
                    </div>
                </div>:<div 
                    className={`card-activity ${inx%2==0?"left":"right"} grid grid-cols-3  `} 
                    onClick={()=>{navigate("/activities/detail", { state: { activity: act } })}} >
                    <div className={`col-span-2 px-2 flex column justify-center  items-end  `} style={{textAlign:"right"}}>
                        <label className="date">{act?.dateActivity}</label>
                        <label className="description">{act?.name}</label>
                    </div>
                    <div className="flex  justify-end items-end"> 
                       <div className="act-img col-span-1 my-1 mx-1" style={{backgroundImage:`url(${apiUrl}/api/file/drive-image/${act?.coverImagePath})`}} ></div>
                    </div>
                    
                </div>
                )

            }
        </div>
    </div>
    )
}

export default Activities;