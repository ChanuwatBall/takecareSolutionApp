 
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Activities.css"
import { useEffect } from "react";
const apiUrl = import.meta.env.VITE_API;


const ActivitieDetail=()=>{
    const location = useLocation(); 
    const navigate = useNavigate()
    const activity =  location.state?.activity
 
    useEffect(()=>{
        console.log("activity ",activity)    
        if(!activity){
            navigate(-1)
        }
    },[])
     

    return(
    <div className="page mb-6">   
        <div className="button-title" >
            กิจกรรม
        </div> 

        <div className="card-activity p-0 "  >
            <img src={`${apiUrl}/api/file/drive-image/${activity?.coverImagePath}` } alt="activity-cover" className="w-100"   />
            <br/>
            <h5>{activity?.name}</h5>
            <p>{activity?.description}</p>

            <div className="  grid  grid-cols-2 my-3 mt-5" >
                <div className="flex items-center justify-center" >
                    <button className="bg-hilight  detail-hilight "  >สถานที่จัดงาน: {activity?.location}</button>
                </div>
                <div className="flex items-center justify-center" >
                     <button  className="bg-hilight detail-hilight " >วันที่ {activity?.dateActivity}</button>
                </div>
            </div>
        </div>


    </div>
    )
}

export default ActivitieDetail;