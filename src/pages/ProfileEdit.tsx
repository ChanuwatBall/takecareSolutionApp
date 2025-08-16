import { useEffect, useState } from "react";
import { CircleImageUploader } from "./Register";
import { getCookie, setCookie, updatevillager, userLineid } from "../action";
import Loading from "../components/Loading"; 
import { useNavigate } from "react-router-dom";
import { useAlert } from "../components/AlertContext";
import { headersize } from "../components/PageHeader";
import PullToRefreshComponent from "../components/PullToRefreshComponent";

const apiUrl = import.meta.env.VITE_API;

const ProfileEdit=()=>{
    const [showAlert] = useAlert();
    const navigate = useNavigate()
    const [image,setImage] = useState<any>(null)
    const [imgFormat , setImgFormat] = useState("jpeg")
    const [firstName , setFirstName] = useState("")
    const [lastName , setLastName] = useState("")
    const [phone , setPhone] = useState("")
    const [birthDate , setBirthDate] = useState("")
    const [address , setAddress] = useState("")
    const [gender , setGender] = useState("") 
    const [fammember , setFammember] = useState("0") 
    const [loading,setLoading] = useState(false)
    
   const imagesprofile=(e:any)=>{
        console.log("imagesprofile ",e) 
        setImage(e?.dataUrl)
        setImgFormat(e?.format)
    }
    useEffect(()=>{
       headersize()
        const getlocalprofile=async ()=>{
            const member = await getCookie("member")
            console.log("member ",member)
            if(member){ 
                setImage(apiUrl+"/api/file/drive-image/"+member?.profile)
                setFirstName(member?.firstName)
                setLastName(member?.lastName)
                setPhone(member?.phoneNumber)
                setBirthDate(member?.birthDate)
                setAddress(member?.address)
                setGender(member?.gender) 
            }
        }
        getlocalprofile()
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
          setLoading(true)
          
         const profile = await getCookie("profile")
         const member = await getCookie("member")
         let fileprofile = null
         if(image.indexOf("profile.line-scdn.net") > -1 || image.indexOf("/api/file/drive-image/") > -1){
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
          formData.append('familyMember',fammember);  
          formData.append('id',member?.id);  
          
          let lineUserId:any =profile?.userId 
          formData.append('lineUserId', lineUserId ); 
          
          const result = await updatevillager(formData)
          console.log(" updatevillager result ",result)
          console.log(" updatevillager result type ", typeof result)
          if(result?.result || (typeof result == "string"  && result.indexOf("result\":true,") > -1 ) ){ 
            if( (typeof result == "string")){  
               const usr = await userLineid(profile?.userId)
               setCookie("member", usr?.villager,30)
            }else{ 
              setCookie("member", result?.villager,30)
            }  
            showAlert( "แก้ไขข้อมูลโปรไฟล์สำเร็จ  ","success")
            navigate(-1) 
          }else{ 
            showAlert( "แก้ไขข้อมูลโปรไฟล์ไม่สำเร็จ กรุณาลองใหม่ภายหลัง ","error")
          } 
          setLoading(false)
                  
      };

    return(
    <PullToRefreshComponent > 
    <div  id="page" className="page">  
    <Loading open={loading} />
     <div className="  flex justify-center column items-center pt-5"> 
            <label className="text-primary-light my-5 font-medium"> แก้ไขข้อมูล</label>
            <div className="profile-images" >
                <CircleImageUploader onChange={imagesprofile} image={image} />
            </div>
             <div className="w-full max-w-md bg-white mt-4 p-4 rounded-xl shadow"  >
                <label className="block mb-2">ชื่อ*
                  <input 
                    type="text" name="firstName"  value={firstName}
                    className="w-full border p-2 rounded border-gray-300"
                    onChange={(e:any)=>{setFirstName(e.target.value)}} />
                  </label>
                <label className="block mb-2">นามสกุล*
                  <input 
                   type="text" name="lastName" value={lastName}
                   className="w-full border p-2 rounded border-gray-300" 
                   onChange={(e)=>{setLastName(e.target.value)}} 
                  /></label>
                <label className="block mb-2">หมายเลขโทรศัพท์*
                  <input 
                    type="tel" name="phone" value={phone} maxLength={10} 
                    className="w-full border p-2 rounded border-gray-300" 
                    onChange={(e)=>{setPhone(e.target.value)}} />
                  </label>
                <label className="block mb-2">วันเกิด*
                   <input 
                    type="date" name="birthDate" value={birthDate}
                    className="w-full border p-2 rounded border-gray-300" 
                    onChange={(e)=>{setBirthDate(e.target.value)}} 
                  /></label>
                <label className="block mb-2">จำนวนสมาชิกในครอบครัว
                   <input 
                    type="number" name="fammiltMember" value={fammember} min={0} max={100}
                    className="w-full border p-2 rounded border-gray-300" 
                    onChange={(e)=>{setFammember(e.target.value)}} 
                /></label>
                <label className="block mb-2">ที่อยู่
                   <textarea 
                      name="address" value={address}
                      className="w-full border p-2 rounded border-gray-300" 
                      onChange={(e)=>{setAddress(e.target.value)}}
                   ></textarea></label> 
            </div>
            <div className="w-full max-w-md bg-white mt-4 p-4 mb-4 rounded-xl shadow"> 
                <div className="mb-2">เพศ*<div>
                <label className="mr-4">
                  <input 
                    type="radio" name="gender" value="ชาย" checked={gender?.match("male")?true:false}
                    onChange={()=>{setGender("male")}}/> ชาย
                  </label>
                <label>
                  <input 
                    type="radio" name="gender" value="หญิง" checked={gender?.match("female")?true:false}
                    onChange={()=>{setGender("female")}}/> หญิง
                  </label>
                </div></div>
            </div> 
             <button type="submit" 
              onClick={handleSubmit}
              className="w-full bg-blue-600 bg-primary text-white py-2 rounded hover:bg-blue-700">บันทึก</button>
            <br/><br/><br/>
        </div>
    </div>
    </PullToRefreshComponent>
    )
}
export default ProfileEdit;