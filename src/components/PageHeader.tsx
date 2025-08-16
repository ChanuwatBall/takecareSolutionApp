import type React from "react";
import "./css/PageHeader.css"
import { useEffect, useState } from "react";
import { getDefaultCompay } from "../action";
const apiUrl = import.meta.env.VITE_API;

 export  const headersize=()=>{
     const header = document.getElementById("page-header") as HTMLElement | null;
     const page   = document.getElementById("page") as HTMLElement | null;
     if (!header || !page) return;

     const setOffset = () => {
     page.style.marginTop = `${header.offsetHeight + 20}px`;
     };

     setOffset();

     // update when header size changes (e.g., responsive, async content)
     const ro = new ResizeObserver(setOffset);
     ro.observe(header);

     window.addEventListener("resize", setOffset);
     return () => {
     ro.disconnect();
     window.removeEventListener("resize", setOffset);
     };
 }
const PageHeader:React.FC=()=>{
    const [name ,setName ] = useState("เทศบาลตำบลบางหมาก")
    const [district,setDistrict] = useState("อำเภอเมืองชุมพรจังหวัดชุมพร")
    const [logo ,setLogo] = useState("")

      useEffect(()=>{
        console.log(" window.location.pathname ", window.location.pathname)
        const getcompanydetail=async ()=>{
            const companyapp = await getDefaultCompay()
            console.log("companyapp  ",companyapp)
            setName(companyapp?.name)
            setDistrict(companyapp?.district)
            setLogo(companyapp?.logo)
        }
        getcompanydetail()
       },[ window.location.pathname])

    return( <div id="page-header" className="page-header  flex" >
        <div className="tumbon-name  " >
            <p className="name" ><label>{name}</label></p>
            <div className="address">{district}</div>
        </div>
        <div className="tumbon-logo  " >  
            <div className="blue-tank">
            <div className="inner  "  >  
                <img src={apiUrl+"/api/file/drive-image/"+logo}  alt="Logo" className="logo"  />
            </div>
            </div>
        </div>
    </div>)
}
export default PageHeader;