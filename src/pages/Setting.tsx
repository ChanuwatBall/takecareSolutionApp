
import { useNavigate } from "react-router-dom";
// import { ActionSheet } from "@capacitor/action-sheet";
import { useEffect,  useState, type ReactNode } from "react";
import { deleteCookie, getCookie, policyandterms, setCookie, userLineid } from "../action";
import "./css/Setting.css"

import DOMPurify from 'dompurify';
import liff from "@line/liff";
import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { BouceAnimation } from "../components/Animations";
import { headersize } from "../components/PageHeader";  
import { useModal } from "../components/ModalContext";

const Setting=()=>{
    const navigate = useNavigate()
    const [termsservice , setTermsService] = useState("")
    const [policy , setPolicy] = useState("") 
    const { openComponent ,closeAll } = useModal();
  // const { closeAll } = useModal();
     

    useEffect(()=>{
      headersize() 
      const checkmemberregis=async ()=>{
          const profilecookie:any = await getCookie("profile") 
          const usr = await userLineid(profilecookie?.userId) 
          if(usr?.result &&( profilecookie === null || profilecookie === undefined)){
                const profile:any = await liff.getProfile()
                setCookie("profile",profile,{days:30})
           }
           if(!usr?.result){
               deleteCookie("member")
               deleteCookie("profile")
               localStorage.removeItem("token")
          
               navigate("/")
           }
      }
      checkmemberregis()
      const gettermcondition=async ()=>{
            const result = await policyandterms()
            console.log("result ",result)
            if(result?.policy ){  
                setPolicy(result?.policy)
            }
             if(result?.termsService ){  
                setTermsService(result?.termsService)
            }
        }
        gettermcondition()
    },[])

    const signout=()=>{ 
        deleteCookie("member")
        deleteCookie("profile")
        localStorage.removeItem("token")

        try {
            liff.logout()
        } catch (error) {
            console.log("error")
        }
        
        navigate("/")
    }

    return(
    <PullToRefreshComponent > 
    <div  id="page" className="page" >
        
        <BouceAnimation duration={0.1}> 
        <div className="complaints-menu" >
          <BouceAnimation duration={0.3}> 
            <div className="button-title" >
                ตั้งค่า
            </div>
            </BouceAnimation><br/>

            <div className="setting-menu flex" onClick={()=>{navigate("/profile")}}>
                <img src="../assets/images/person-setting.png" className="icon" />
                <label className="title">ข้อมูลส่วนตัว</label>
            </div>
            <div className="setting-menu flex" onClick={(()=>{navigate("/profile/edit")})}>
                <img src="../assets/images/setting-pin.png" className="icon" />
                <label className="title">แก้ไขข้อมูลส่วนตัว</label>
            </div> 
            <div className="setting-menu flex"  onClick={()=>{openComponent(Confirm, {
              title: "เปลี่ยนภาษา",
              message: <div style={{marginTop:"1px solid #ddd"}}>
                <ul className="list-language" >
                  <li className="text-primary" onClick={()=>{closeAll()}}>ภาษาไทย</li> 
                </ul>
              </div>,
              onConfirm: () => console.log("confirmed!"),
            }) }} >
                <img src="../assets/images/setting-language.png" className="icon" style={{width:"1.4rem"}} />
                <label className="title text-black">ตั้งค่าภาษา</label>  
            </div>
            <div className="setting-menu flex"   
              onClick={()=>{openComponent(Confirm, {
                title: "นโยบายการใช้ข้อมูล",
                message:  <PolicyView  html={policy} />,
                onConfirm: () => console.log("confirmed!"),
              }) }}
            >
                <img src="../assets/images/setting-privacy.png" className="icon" />
                <label className="title">นโยบายการใช้ข้อมูล</label>
            </div>
            <div className="setting-menu flex"  
              onClick={()=>{openComponent(Confirm, {
                title: "ข้อกำหนดการบริการ",
                message:  <PolicyView  html={termsservice} />,
                onConfirm: () => console.log("confirmed!"),
              }) }}
              >
                <img src="../assets/images/setting-policy.png" className="icon" style={{width:"1.3rem"}}/>
                <label className="title">ข้อกำหนดการบริการ</label>
            </div>
            {/* <div className="setting-menu flex" style={{border:"none"}}  onClick={()=>  signout() }>
                <img src="../assets/images/signout.png" className="icon" style={{width:"1.3rem"}}/>
                <label className="title">ออกจากระบบ</label>
            </div> */}

        </div>
        </BouceAnimation> 

    </div>
      
    </PullToRefreshComponent>
    )
}
export default Setting;
 
type ConfirmProps = {
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
};

function Confirm({ title, message, onConfirm  }: ConfirmProps) {
  const { closeAll } = useModal();
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, minWidth: 340 }}>
      <h3 className="text-black text-bold" style={{ marginTop: 0 , marginBottom:"1rem" }}>{title}</h3>
      <p className="text-black">{message}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" ,paddingTop:"1rem" }}>
        {/* <button onClick={() => { onCancel?.(); closeAll(); }}>Cancel</button> */}
        <button onClick={() => { onConfirm(); closeAll(); }}>ปิด</button>
      </div>
    </div>
  );
}
 


type PolicyViewProps = {
  html: string; // ได้มาจาก DB
};
function PolicyView({ html }: PolicyViewProps) {
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: clean }} />;
}
 