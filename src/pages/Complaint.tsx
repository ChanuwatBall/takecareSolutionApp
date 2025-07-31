import { useNavigate } from "react-router-dom";
import "./css/Complaint.css"

const Complaint=()=>{
  const navigate = useNavigate();

    const ComplaintMenu=[
        {
            label:"ถนน" ,
            value:"road" ,
            id:1,
            icon:"assets/images/Asset 2@3x.png"
        },
         {
            label:"ประปา" ,
            value:"water" ,
            id:2,
            icon:"assets/images/Asset 3@3x.png"
        },
         {
            label:"ขยะ" ,
            value:"trash" ,
            id:3,
            icon:"assets/images/Asset 4@3x.png"
        },
         {
            label:"เหตุเดือดร้อน /รำคาญ" ,
            value:"heat" ,
            id:4,
            icon:"assets/images/Asset 5@3x.png"
        },
        {
            label:"สัตว์จรจัด" ,
            value:"animals" ,
            id: 5,
            icon:"assets/images/Asset 6@3x.png"
        },
        {
            label:"ซ่อมแซม" ,
            value:"maintenance" ,
            id: 6,
            icon:"assets/images/Asset 7@3x.png"
        },
        {
            label:"ตัดต้นไม้" ,
            value:"trees" ,
            id: 7,
            icon:"assets/images/Asset 8@3x.png"
        },
        {
            label:"ทำความสะอาด" ,
            value:"clean" ,
            id: 8,
            icon:"assets/images/Asset 9@3x.png"
        }
        ,
        {
            label:"อื่นๆ" ,
            value:"other" ,
            id: 9,
            icon:"assets/images/Asset 9@3x.png"
        }
    ]

    return(
    <div className="page grid" >
        <div className="title-row set-row" >
            <div className="complaint-button-title">
                <div className="wrap-img" >
                    <img src="assets/images/Asset12@3x.png" />
                </div>
                <label>แจ้งเรื่องร้องทุกข์</label>
            </div>
            <div className="top-continue-complaint-menu" >  </div>
        </div> 
        <div  className="complaints-menu" >
            <div className="grid grid-cols-3 grid-rows-3 gap-4 p-4">
            {
                ComplaintMenu.map((menu , index) => 
                    <div key={index}  
                        className=" flex items-center justify-start  h-32 text-center " 
                        style={{flexDirection:"column"}} 
                        onClick={()=>{navigate("/complaint/add")}}
                    >
                        <img src={menu?.icon} alt={menu?.value} className="mt-4" />
                        <label className="text-sm" >{menu?.label}</label>
                    </div>
                )
            }
            </div>
        </div>
    </div>
    )
}
export default Complaint;