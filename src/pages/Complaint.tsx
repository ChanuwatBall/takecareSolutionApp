import { useNavigate } from "react-router-dom";
import "./css/Complaint.css"
import { useEffect, useState } from "react";
import liff from "@line/liff";
import {   getComplaintmenu, getStorage,   setStorage, userLineid } from "../action";
import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { BouceAnimation } from "../components/Animations";
import { headersize } from "../components/PageHeader";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import { encodeBase64 } from "../action";
const apiUrl = import.meta.env.VITE_API;

const Complaint=()=>{
  const navigate = useNavigate();
  const [ComplaintMenu,setComplaintMenu] = useState<any[]>([])

  useEffect(()=>{
        const checkmemberregis=async ()=>{ 
            const profilecookie:any = await getStorage("profile")   
            const usr = await userLineid(profilecookie?.userId) 
            if(usr?.result &&( profilecookie === null || profilecookie === undefined)){
                 const profile:any = await liff.getProfile()
                //  setCookie("profile",profile,{days:30})
                setStorage("profile",profile)
            }
            if(!usr?.result){
                // deleteCookie("member")
                // deleteCookie("profile")

                localStorage.removeItem("member")
                localStorage.removeItem("profile")
                localStorage.removeItem("token")
                      
                navigate("/")
            }

            const menulist = await getComplaintmenu()
            setComplaintMenu(menulist)
            console.log("menulist ",menulist)
        }
        checkmemberregis()
 
    headersize()
  },[])
    // const ComplaintMenu=[
    //     {
    //         label:"ถนน" ,
    //         value:"road" ,
    //         id:1,
    //         icon:"assets/images/Asset 2@3x.png"
    //     },
    //      {
    //         label:"ประปา" ,
    //         value:"water" ,
    //         id:2,
    //         icon:"assets/images/Asset 3@3x.png"
    //     },
    //      {
    //         label:"ขยะ" ,
    //         value:"trash" ,
    //         id:3,
    //         icon:"assets/images/Asset 4@3x.png"
    //     },
    //      {
    //         label:"เหตุเดือดร้อน /รำคาญ" ,
    //         value:"heat" ,
    //         id:4,
    //         icon:"assets/images/Asset 5@3x.png"
    //     },
    //     {
    //         label:"สัตว์จรจัด" ,
    //         value:"animals" ,
    //         id: 5,
    //         icon:"assets/images/Asset 6@3x.png"
    //     },
    //     {
    //         label:"ซ่อมแซม" ,
    //         value:"maintenance" ,
    //         id: 6,
    //         icon:"assets/images/Asset 7@3x.png"
    //     },
    //     {
    //         label:"ตัดต้นไม้" ,
    //         value:"trees" ,
    //         id: 7,
    //         icon:"assets/images/Asset 8@3x.png"
    //     },
    //     {
    //         label:"ทำความสะอาด" ,
    //         value:"clean" ,
    //         id: 8,
    //         icon:"assets/images/Asset 9@3x.png"
    //     } ,
    //     {
    //         label:"บริการจัดเก็บภาษี" ,
    //         value:"taxCollection" ,
    //         id: 9,
    //         icon:"assets/images/ICON1.png"
    //     } ,
    //     {
    //         label:"งานทะเบียนพาณิชย์" ,
    //         value:"registration" ,
    //         id: 10,
    //         icon:"assets/images/ICON2.png"
    //     } ,
    //     {
    //         label:"ซ่อมแซมไฟสาธารณะ" ,
    //         value:"powerRepair" ,
    //         id: 11,
    //         icon:"assets/images/ICON3.png"
    //     } ,
    //     {
    //         label:"อื่นๆ" ,
    //         value:"other" ,
    //         id: 12,
    //         icon:"assets/images/other.png"
    //     }
    // ]

    return(
        <PullToRefreshComponent > 
    <div  id="page" className="page  " > <br/> 
        <BouceAnimation duration={0.1}>
        <div className="title-row set-row" >
            <div className="complaint-button-title">
                <div className="wrap-img" >
                    <img src="assets/images/Asset12@3x.png" />
                </div>
                <label>แจ้งเรื่องร้องทุกข์</label>
            </div>
            <BouceAnimation duration={0.3}>
             <div className="top-continue-complaint-menu" >  </div>
            </BouceAnimation>
        </div> 
        </BouceAnimation>
        <BouceAnimation duration={0.1}>
        <div  className="complaints-menu" >
            <div className="grid grid-cols-3 grid-rows-3 gap-4 p-4">
            {
                ComplaintMenu.map((menu , index) => 
                    <BouceAnimation duration={0.1+( index/10)}>
                    <div key={index}  
                        className=" flex items-center justify-start  h-32 text-center " 
                        style={{flexDirection:"column" , justifyContent:"center" , alignItems:"center"}} 
                        onClick={()=>{navigate(`/complaint/add/${menu?.value}}`,{state:{complaintmenu:menu }})}}
                    >
                        <LazyLoadImage  
                        src={apiUrl+menu?.icon} 
                        // src={apiUrl+"/images/svg/person.svg"} 
                        alt={menu?.value} className="pt-4" style={{maxWidth:"7rem"}} />
                        <label className="text-sm text-black" >{menu?.label}</label>
                    </div>
                    </BouceAnimation>
                )
            }
            </div>
        </div>
        </BouceAnimation>
    </div> <br/>  <br/> 
    </PullToRefreshComponent>
    )
}
export default Complaint;