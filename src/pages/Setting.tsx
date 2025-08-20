
import { useNavigate } from "react-router-dom";
// import { ActionSheet } from "@capacitor/action-sheet";
import "./css/Setting.css"
import { useEffect, useRef, useState, type ReactNode } from "react";
import { deleteCookie, getCookie, policyandterms, setCookie, userLineid } from "../action";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [termsModal, setTemsModal] = useState(false); 
  const { openComponent } = useModal();
    // const [languaeSelected,setSelectedOption] = useState({value:"th", label:"ภาษาไทย"}) 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // const settingLanguage=async ()=>{
    //    await ActionSheet.showActions({
    //     title: 'ตั้งค่าภาษา',
    //     message: 'เลือกการทำงาน', 
    //     //  backdropDismiss: false ,
    //     options: [
    //       { title: 'ภาษาไทย' }, 
    //       // { title: 'ยกเลิก', style: ActionSheetButtonStyle.Cancel }
    //     ]
    //   });
    // }

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
      title: "Delete item?",
      message: "This action cannot be undone.",
      onConfirm: () => console.log("confirmed!"),
    }) }} >
                <img src="../assets/images/setting-language.png" className="icon" style={{width:"1.4rem"}} />
                <label className="title">ตั้งค่าภาษา</label>  
            </div>
            <div className="setting-menu flex"  onClick={openModal}>
                <img src="../assets/images/setting-privacy.png" className="icon" />
                <label className="title">นโยบายการใช้ข้อมูล</label>
            </div>
            <div className="setting-menu flex"  onClick={()=>setTemsModal(true)}>
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t"> 
          <button
            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={closeModal}
          >
            <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
          </button>
        </div>
        <div className="relative p-6 flex-auto"  style={{paddingTop:"190vh"}}> 
          <PolicyView  html={policy} />
        </div>
        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
            type="button"
            onClick={closeModal}
          >
            Close
          </button> 
        </div>
      </Modal>

       <Modal isOpen={termsModal} onClose={()=>{setTemsModal(true)}}>
        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t"> 
          <button
            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={()=>setTemsModal(false)}
          >
            <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
          </button>
        </div>
        <div className="relative p-6 flex-auto"  style={{paddingTop:"130vh"}}> 
          <PolicyView  html={termsservice} />
        </div>
        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
            type="button"
            onClick={()=>setTemsModal(false)}
          >
            Close
          </button> 
        </div>
      </Modal>   
    </PullToRefreshComponent>
    )
}
export default Setting;

//  export function ModalCenter({children , title}:{children:ReactNode , title:ReactNode }) {
//   const { open } = useModal();

//   const showCustom = () => {
//     open(
//       <div style={{
//         background: "white",
//         borderRadius: 16,
//         padding: 20,
//         minWidth: 320,
//         boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
//       }}>
//         {/* <h3 style={{ marginTop: 0 }}>Hello!</h3>
//         <p>This is any content you want.</p> */}
//         {children}
//       </div>
//     );
//   };

//   return <div onClick={showCustom}> {title} </div>;
// }

type ConfirmProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

function Confirm({ title, message, onConfirm, onCancel }: ConfirmProps) {
  const { closeAll } = useModal();
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, minWidth: 340 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p>{message}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={() => { onCancel?.(); closeAll(); }}>Cancel</button>
        <button onClick={() => { onConfirm(); closeAll(); }}>OK</button>
      </div>
    </div>
  );
}

export function DangerAction() {
  const { openComponent } = useModal();

  const ask = () => {
    openComponent(Confirm, {
      title: "Delete item?",
      message: "This action cannot be undone.",
      onConfirm: () => console.log("confirmed!"),
    });
  };

}


const Modal = ({ isOpen, onClose, children }:any) => {
  if (!isOpen) return null;

  return (
    <div 
    className="modal fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-auto max-w-lg mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none" >
          {children}
        </div>
      </div>
    </div>
  );
};


type PolicyViewProps = {
  html: string; // ได้มาจาก DB
};
function PolicyView({ html }: PolicyViewProps) {
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: clean }} />;
}
 