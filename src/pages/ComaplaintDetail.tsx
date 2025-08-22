import { useParams } from "react-router-dom";
import PullToRefreshComponent from "../components/PullToRefreshComponent"

const ComaplaintDetail=()=>{
    const { complaintId } = useParams(); 
    
    return(
    <PullToRefreshComponent >
       <div id="page" className="page  " style={{ position: "relative" }} >
        
        </div>
    </PullToRefreshComponent>

    )
}
export default ComaplaintDetail;