
import { useNavigate } from "react-router-dom";
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import "./css/Setting.css"
import { useEffect, useState } from "react";
import { policyandterms } from "../action";

const Setting=()=>{
    const navigate = useNavigate()
    const [termsservice , setTermsService] = useState("")
    const [policy , setPolicy] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const settingLanguage=async ()=>{
       await ActionSheet.showActions({
        title: 'ตั้งค่าภาษา',
        message: 'เลือกการทำงาน', 
        options: [
          { title: 'ภาษาไทย' }, 
          { title: 'ยกเลิก', style: ActionSheetButtonStyle.Cancel }
        ]
      });
    }

    useEffect(()=>{
        const gettermcondition=async ()=>{
            const result = await policyandterms()
            console.log("result ",result)
            if(result?.policy && result?.termsService){ 
                setTermsService(result?.termsService)
                setPolicy(result?.policy)
            }
        }
        gettermcondition()
    },[])

    return(
    <div className="page" >
        
        <div className="complaints-menu" >
            <div className="button-title" >
                ตั้งค่า
            </div><br/>

            <div className="setting-menu flex" onClick={()=>{navigate("/profile")}}>
                <img src="../assets/images/person-setting.png" className="icon" />
                <label className="title">ข้อมูลส่วนตัว</label>
            </div>
            <div className="setting-menu flex">
                <img src="../assets/images/setting-pin.png" className="icon" />
                <label className="title">ที่อยู่</label>
            </div>
            <div className="setting-menu flex" onClick={()=>{settingLanguage()}}>
                <img src="../assets/images/setting-language.png" className="icon" style={{width:"1.4rem"}} />
                <label className="title">ตั้งค่าภาษา</label>
            </div>
            <div className="setting-menu flex"  onClick={openModal}>
                <img src="../assets/images/setting-privacy.png" className="icon" />
                <label className="title">นโยบายการใช้ข้อมูล</label>
            </div>
            <div className="setting-menu flex" style={{border:"none"}}  onClick={openModal}>
                <img src="../assets/images/setting-policy.png" className="icon" style={{width:"1.3rem"}}/>
                <label className="title">ข้อกำหนดการบริการ</label>
            </div>

        </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
          <h3 className="text-3xl font-semibold">Modal Title</h3>
          <button
            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={closeModal}
          >
            <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
          </button>
        </div>
        <div className="relative p-6 flex-auto">
          <p className="my-4 text-gray-600 text-lg leading-relaxed">
            This is the content of your modal. You can place any React elements here.
          </p>
        </div>
        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
            type="button"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
            type="button"
            onClick={closeModal}
          >
            Save Changes
          </button>
        </div>
      </Modal>

    </div>
    )
}
export default Setting;



const Modal = ({ isOpen, onClose, children }:any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-auto max-w-lg mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {children}
        </div>
      </div>
    </div>
  );
};
 