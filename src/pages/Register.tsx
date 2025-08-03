import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { useState } from "react"
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';


type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  address: string;
  village: string;
  gender: string;
  agree: boolean;
};
const Register=()=>{
    const [company,setCompany] = useState({id:1 , name:"เทศบาลตำบลบางหมาก"})
    const [image ,setImage] = useState(false)
    const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    address: '',
    village: '',
    gender: '',
    agree: false,
  });

    const imagesprofile=(e:any)=>{
        console.log("imagesprofile ",e)
        setImage(e)
    }
  const handleChange = (e: any) => {
    console.log("handleChange ",e)
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData, image);
  };

    return(
    <div className="page" style={{background:"#F7F7F9"}}>
        <div className="w-100 flex justify-center column items-center pt-5">
            <div className="bg-primary w-fit text-2xl text-white px-4 py-1 rounded-lg" >{company?.name}</div>
            <label className="text-primary-light my-5 font-medium">สมัครสมาชิก</label>
            <div className="profile-images" >
                <CircleImageUploader onChange={imagesprofile} />
            </div>
              <div className="w-full max-w-md bg-white mt-4 p-4 rounded-xl shadow" onSubmit={handleSubmit}>
                <label className="block mb-2">ชื่อ*<input type="text" name="firstName" className="w-full border p-2 rounded border-gray-300" onChange={handleChange} /></label>
                <label className="block mb-2">นามสกุล*<input type="text" name="lastName" className="w-full border p-2 rounded border-gray-300" onChange={handleChange} /></label>
                <label className="block mb-2">หมายเลขโทรศัพท์*<input type="tel" name="phone" className="w-full border p-2 rounded border-gray-300" onChange={handleChange} /></label>
                <label className="block mb-2">วันเกิด*<input type="date" name="birthDate" className="w-full border p-2 rounded border-gray-300" onChange={handleChange} /></label>
                <label className="block mb-2">ที่อยู่<textarea name="address" className="w-full border p-2 rounded border-gray-300" onChange={handleChange}></textarea></label>
                <label className="block mb-2">หมู่บ้าน<select name="village" className="w-full border p-2 rounded border-gray-300" onChange={handleChange}>
                <option value="">เลือกหมู่บ้าน</option>
                <option value="1">หมู่บ้าน 1</option>
                <option value="2">หมู่บ้าน 2</option>
                </select></label>
            </div>
            <div className="w-full max-w-md bg-white mt-4 p-4 rounded-xl shadow"> 
                <div className="mb-2">เพศ*<div>
                <label className="mr-4"><input type="radio" name="gender" value="ชาย" onChange={handleChange}/> ชาย</label>
                <label><input type="radio" name="gender" value="หญิง" onChange={handleChange}/> หญิง</label>
                </div></div>
            </div>
            <div className="w-full max-w-md bg-white mt-4 p-4 rounded-xl shadow">  
                <label className="block mb-4"><input type="checkbox" name="agree" onChange={handleChange}/> ฉันยินยอมให้ร้านเก็บและใช้ข้อมูลส่วนตัวตามนโยบาย</label>
              
            </div><br/>
              <button type="submit" className="w-full bg-blue-600 bg-primary text-white py-2 rounded hover:bg-blue-700">สมัครสมาชิก</button>
        </div>
    </div>
    )
}

export default Register


type ImageUploaderProps = {
  onChange?: (imageDataUrl: any) => void;
};

const CircleImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      setImage(photo.dataUrl || null);
      onChange?.(photo || null);
    } catch (err) {
      console.error('Image selection cancelled or failed', err);
    }
  };

  const handleImageClick = async () => {
    if (image) {
    //   const action = window.confirm('เลือก "ตกลง" เพื่ออัปโหลดใหม่ หรือ "ยกเลิก" เพื่อนำรูปออก');
    const result = await ActionSheet.showActions({
        title: 'ตัวเลือก',
        message: 'เลือกการทำงาน', 
        options: [
          { title: 'อัปโหลดใหม่' },
          { title: 'นำรูปออก', style: ActionSheetButtonStyle.Destructive },
          { title: 'ยกเลิก', style: ActionSheetButtonStyle.Cancel }
        ]
      });
       if (result.index === 0) {
        pickImage();
      } else if (result.index === 1) {
        setImage(null);
        onChange?.(null);
      }
    } else {
      pickImage();
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <div
        className="w-60 h-60 rounded-full border-2 border-white flex items-center justify-center overflow-hidden cursor-pointer shadow-md"
        onClick={handleImageClick}
      >
        {image ? (
          <img src={image} alt="Uploaded" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-grey"></div>
        )}
      </div>
    </div>
  );
};
  
