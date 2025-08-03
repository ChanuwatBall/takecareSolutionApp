import type React from "react";
import "./css/PageHeader.css"
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API;

const PageHeader:React.FC=()=>{
    const [tumbon ] = useState("เทศบาลตำบลบางหมาก")
    const [address] = useState("อำเภอเมืองชุมพรจังหวัดชุมพร")
      useEffect(()=>{
        console.log(" window.location.pathname ", window.location.pathname)
       },[ window.location.pathname])

    return(window.location.pathname !== "/" &&<div className="page-header  flex" >
        <div className="tumbon-name  " >
            <p className="name" ><label>{tumbon}</label></p>
            <div className="address">{address}</div>
        </div>
        <div className="tumbon-logo  " >  
            <div className="blue-tank">
            <div className="inner  "  >  
                <img src={apiUrl+"/api/file/drive-image/1X0TewqnVRYQxzyYePXcwHucbYv0WbCSV"}  alt="Logo" className="logo"  />
            </div>
            </div>
        </div>
    </div>)
}
export default PageHeader;