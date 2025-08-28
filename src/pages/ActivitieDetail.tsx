 
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Activities.css"
import { useEffect } from "react";
import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { BouceAnimation } from "../components/Animations";
import { headersize } from "../components/PageHeader";
import { LazyLoadImage } from "react-lazy-load-image-component";
const apiUrl = import.meta.env.VITE_API;


const ActivitieDetail=()=>{
    const location = useLocation(); 
    const navigate = useNavigate()
    const activity =  location.state?.activity
 
    useEffect(()=>{
        headersize()
        console.log("activity ",activity)    
        if(!activity){
            navigate(-1)
        }
    },[])
     

    return(
    <PullToRefreshComponent > 
    <div id="page" className="page mb-6">  
        <BouceAnimation duration={0.1}>
        <div className="button-title" >
            กิจกรรม
        </div> </BouceAnimation> 

        <div className="card-activity p-0 "  >
            <BouceAnimation duration={0.6}>
              <LazyLoadImage src={`${apiUrl}/api/file/drive-image/${activity?.coverImagePath}` } alt="activity-cover" className="w-100"   />
            </BouceAnimation>
            <br/>
            <BouceAnimation duration={0.2}> 
              <h5>{activity?.name}</h5>
            </BouceAnimation>
            <BouceAnimation duration={0.3}> 
              <p>{activity?.description}</p>
            </BouceAnimation>

            <div className="  grid  grid-cols-2 my-3 mt-5" >
                <BouceAnimation duration={0.3}> 
                    <div className="flex items-center justify-center" >
                        <button className="bg-hilight  detail-hilight "  >สถานที่จัดงาน: {activity?.location}</button>
                    </div>
                </BouceAnimation>
                <BouceAnimation duration={0.3}> 
                    <div className="flex items-center justify-center" >
                        <button  className="bg-hilight detail-hilight " >วันที่ {activity?.dateActivity}</button>
                    </div>
                </BouceAnimation>
            </div>
        </div>

        <br/><br/>
    </div>  
    </PullToRefreshComponent>
    )
}

export default ActivitieDetail;