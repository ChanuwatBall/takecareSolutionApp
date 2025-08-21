import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { useEffect, useState } from "react"
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";
import { getDefaultCompay, registerNewMember, setCookie, userLineid, villageoption } from "../action";
import Select from 'react-select';
import { isAuthenticated } from "../auth"; 
import PullToRefreshComponent from "../components/PullToRefreshComponent";
import { useDispatch } from "react-redux";
import { setLoaing } from "../store/appSlice"; 
 
 
interface LineProfile {
    userId: String
    displayName: String
    statusMessage:  String
    pictureUrl:  String
}

const Register=()=>{
    const navigate = useNavigate(); 
    const dispatch = useDispatch()
    const [company,setCompany] = useState<any>({id:1 , name:"เทศบาลตำบลบางหมาก"})
    const [isimage ,setIsImage] = useState(false)
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [options , setOptions] = useState([])
    const [lineprofile,setLineProfile]=useState<LineProfile | null>(null)
    const [image,setImage] = useState<any>(null)
    const [imgFormat , setImgFormat] = useState("jpeg")
    const [firstName , setFirstName] = useState("")
    const [lastName , setLastName] = useState("")
    const [phone , setPhone] = useState("")
    const [birthDate , setBirthDate] = useState("")
    const [fammember , setFammember] = useState("0") 
    const [address , setAddress] = useState("")
    const [gender , setGender] = useState("")
    const [agree , setAgree] = useState(false)  
     

    const imagesprofile=(e:any)=>{
        console.log("imagesprofile ",e)
        setIsImage(e)
        setImage(e?.dataUrl)
        setImgFormat(e?.format)
    }
    

  useEffect(()=>{
    dispatch(setLoaing(true))
    const initline=async ()=>{
      if(!isAuthenticated()){ 
        const companyapp = await getDefaultCompay() 
        console.log("companyapp ",companyapp)
          if(companyapp && companyapp?.liffId){
          liff.init({ liffId: companyapp?.liffId })
          .then(async () => {
        //     console.log('LIFF init success');
            if (!liff.isLoggedIn()) {
              liff.login(); 
            }
            getvillage()
          
          })
          .catch((err) => {
            console.log("error ", err)
        }); 
        } 
      }else{
        window.location.href = "/home"
      }
    }
    initline()
    dispatch(setLoaing(false))
    
    const getvillage=async()=>{ 
      const companyapp = await getDefaultCompay() 
      console.log("companyapp ",companyapp)
      setCompany(companyapp)
      const opts= await villageoption(companyapp?.id)
      console.log("opts ",opts)
      setOptions(opts)
 
      const profile:any = await liff.getProfile() 

      const usr = await userLineid(profile?.userId)
      console.log("userLineid usr ",usr)
      if(usr.result ){
        // window.location.href = "/home"
        setCookie("member", usr?.villager,{days:30})
        setCookie("profile", profile ,{days:30})
        localStorage.setItem("token", JSON.stringify(liff.getAccessToken()))  
        navigate("/home")
        setTimeout(()=>{
          window.location.reload()
        },500)
       
      }else{ 
        navigate("/register")
      }

      setLineProfile(profile)
      console.log("profile ",profile)
      setImage(profile?.pictureUrl)

    }
  },[])

  const fetchImage = async (imageUrl:any) => { 
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: blob.type });
 
        return await file //mageUrlFromFile 
  }

  const dataURLToFile = (dataUrl: string, filename: string): File => {
    // Split the dataURL into the base64 part and the metadata part
    const [metadata, base64String] = dataUrl.split(',');
    console.log("metadata  ",metadata)
    // Convert the base64 string to a binary format (ArrayBuffer)
    const byteCharacters = atob(base64String); // Decode the base64 string
    const byteArrays = [];

    // Convert the byteCharacters into an array of bytes
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      byteArrays.push(byteCharacters.charCodeAt(offset));
    }

    // Create a Blob from the binary data
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: 'image/'+imgFormat  });

    // Convert the Blob into a File
    return new File([blob], filename, { type: 'image/'+imgFormat  });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
      dispatch(setLoaing(true))
      console.log("profile ",lineprofile)
      console.log('Form submitted:', isimage);  
     console.log("village  ", selectedOption)
     let fileprofile = null
     if(image.indexOf("profile.line-scdn.net") > -1 ){
      fileprofile = await fetchImage(image)
      console.log("file ",fileprofile)
     }else{
      fileprofile =  dataURLToFile(image , "profile-upload."+imgFormat)
      console.log("file ",fileprofile)
     } 

     const formData = new FormData();
      formData.append('image',fileprofile);
      formData.append('firstName',firstName); 
      formData.append('lastName',lastName);
      formData.append('phone',phone);
      formData.append('birthDate',birthDate);
      formData.append('address',address);
      formData.append('gender',gender); 
      formData.append('agree',agree.toString()); 
      
      let lineUserId:any =lineprofile?.userId
      let lineName:any =lineprofile?.displayName
      formData.append('lineUserId', lineUserId );
      formData.append('lineName', lineName );
      formData.append('villageId', selectedOption?.value );
      formData.append('companyId', company?.id );
      formData.append('familyMember',fammember);  
      
      const result = await registerNewMember(formData)
      console.log(" registerNewMember result ",result)
      console.log(" registerNewMember result type ", typeof result)
      if(result?.result || (typeof result == "string"  && result.indexOf("result\":true,") > -1 ) ){ 
        if( (typeof result == "string")){ 
          const usr = await userLineid(lineprofile?.userId)
          console.log("userLineid usr ",usr)
          setCookie("member", usr?.villager,{days:30})
        }else{ 
          setCookie("member", result?.villager,{days:30})
        }
        setCookie("profile", lineprofile ,{days:30})
        localStorage.setItem("token", JSON.stringify(liff.getAccessToken()))  
        navigate("/home")
        window.location.reload()
      }else{

      } 
      dispatch(setLoaing(true))
              
  };
  const handleChangeOpt = (selectedOption:any) => {
    setSelectedOption(selectedOption);
  };


    return(
    <PullToRefreshComponent > 
    <div className="page no-margin" style={{background:"#F7F7F9"}}> 
        <div className=" flex justify-center column items-center pt-5">
            <div className="bg-primary w-fit text-2xl text-white px-4 py-1 rounded-lg" >{company?.name}</div>
            <label className="text-primary-light my-5 font-medium">สมัครสมาชิก</label>
            <div className="profile-images" >
                <CircleImageUploader onChange={imagesprofile} image={image} />
            </div>
              <div className="w-full max-w-md bg-white mt-4 p-4 rounded-xl shadow"  >
                <label className="block mb-2 text-black">ชื่อ*
                  <input 
                    type="text" name="firstName" 
                    className="w-full border p-2 rounded border-gray-300"
                    onChange={(e:any)=>{setFirstName(e.target.value)}} />
                  </label>
                <label className="block mb-2 text-black">นามสกุล*
                  <input 
                   type="text" name="lastName" 
                   className="w-full border p-2 rounded border-gray-300" 
                   onChange={(e)=>{setLastName(e.target.value)}} 
                  /></label>
                <label className="block mb-2 text-black">หมายเลขโทรศัพท์*
                  <input 
                    type="tel" name="phone" maxLength={10}
                    className="w-full border p-2 rounded border-gray-300" 
                    onChange={(e)=>{setPhone(e.target.value)}} />
                  </label>
                <label className="block mb-2 text-black">วันเกิด*
                   <input 
                    type="date" name="birthDate"  style={{minHeight:"2.5rem"}}
                    className="w-full border p-2 rounded border-gray-300" 
                    onChange={(e)=>{setBirthDate(e.target.value);}} 
                  /></label>

                <label className="block mb-2 text-black">จำนวนสมาชิกในครอบครัว
                   <input 
                    type="number" name="fammiltMember" value={fammember} min={0} max={100}
                    className="w-full border p-2 rounded border-gray-300" 
                    onChange={(e)=>{setFammember(e.target.value)}} 
                /></label>
                <label className="block mb-2 text-black">ที่อยู่
                   <textarea 
                      name="address" 
                      className="w-full border p-2 rounded border-gray-300" 
                      onChange={(e)=>{setAddress(e.target.value)}}
                   ></textarea></label>
                <label className="block mb-2 text-black">หมู่บ้าน
                  <Select
                    options={options}
                    value={selectedOption}
                    onChange={handleChangeOpt}
                    placeholder="เลือกหมู่บ้าน..."
                  />
                 
                </label> 
            </div>
            <div className="w-full max-w-md bg-white mt-4 p-4 rounded-xl shadow"> 
                <div className="mb-2 text-black">เพศ*<div>
                <label className="mr-4">
                  <input 
                    type="radio" name="gender" value="ชาย" 
                    onChange={()=>{setGender("male")}}/> ชาย
                  </label>
                <label>
                  <input 
                    type="radio" name="gender" value="หญิง" 
                    onChange={()=>{setGender("female")}}/> หญิง
                  </label>
                </div></div>
            </div>
            <div className="w-full max-w-md bg-white mt-4 p-4 rounded-xl shadow">  
                <label className="block mb-4 text-black">
                  <input type="checkbox" name="agree"
                   onChange={()=>{setAgree(true)}}
                  /> &nbsp; ฉันยินยอมให้ร้านเก็บและใช้ข้อมูลส่วนตัวตามนโยบาย</label>
              
            </div><br/>
              <button type="submit" 
              onClick={handleSubmit}
              className="w-full bg-blue-600 bg-primary text-white py-2 rounded hover:bg-blue-700">สมัครสมาชิก</button>
        </div>
        <br/>
    </div>
    </PullToRefreshComponent>
    )
}

export default Register


type ImageUploaderProps = {
  onChange?: (imageDataUrl: any) => void;
  image: any
};

export const CircleImageUploader: React.FC<ImageUploaderProps> = ({ onChange  ,image}) => {

  const pickImage = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      // setImage(photo.dataUrl || null);
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
        // setImage(null);
        onChange?.(null);
      }
    } else {
      pickImage();
    }
  };

  useEffect(()=>{
  },[image])

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
  
