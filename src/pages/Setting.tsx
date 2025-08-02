
import "./css/Setting.css"

const Setting=()=>{

    return(
    <div className="page" >
        
        <div className="complaints-menu" >
            <div className="button-title" >
                ตั้งค่า
            </div><br/>

            <div className="setting-menu flex">
                <img src="../assets/images/person-setting.png" className="icon" />
                <label className="title">ข้อมูลส่วนตัว</label>
            </div>
            <div className="setting-menu flex">
                <img src="../assets/images/setting-pin.png" className="icon" />
                <label className="title">ที่อยู่</label>
            </div>
            <div className="setting-menu flex">
                <img src="../assets/images/setting-language.png" className="icon" style={{width:"1.4rem"}} />
                <label className="title">ตั้งค่าภาษา</label>
            </div>
            <div className="setting-menu flex">
                <img src="../assets/images/setting-privacy.png" className="icon" />
                <label className="title">นโยบายการใช้ข้อมูล</label>
            </div>
            <div className="setting-menu flex" style={{border:"none"}}>
                <img src="../assets/images/setting-policy.png" className="icon" style={{width:"1.3rem"}}/>
                <label className="title">ข้อกำหนดการบริการ</label>
            </div>

        </div>


    </div>
    )
}
export default Setting;