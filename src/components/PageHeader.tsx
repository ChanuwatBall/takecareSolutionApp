import type React from "react";
import "./css/PageHeader.css"
import { useState } from "react";

const PageHeader:React.FC=()=>{
    const [tumbon ,setTumbon] = useState("เทศบาลตำบลบางหมาก")
    const [address,setAddress] = useState("อำเภอเมืองชุมพรจังหวัดชุมพร")

    return(<div className="page-header" >
        <div className="tumbon-name" >
            <p className="name" ><label>{tumbon}</label></p>
            <div className="address">{address}</div>
        </div>
        <div className="tumbon-logo" >
            
        </div>
    </div>)
}
export default PageHeader;