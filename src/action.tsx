import axios from "axios"; 
const apiUrl = import.meta.env.VITE_API;
const token = import.meta.env.VITE_TOKEN;


const api = axios.create({
    baseURL: apiUrl+"/api/liffapp"  ,
    headers: {
        Authorization: "Bearer "+token ,
    //    "Content-Type": "application/json" 
        // 'Content-Type': 'application/json',
    }, 
})


export async function setCookie(name: string, value: any, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
}

export async function getCookie(name: string)  {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const parse:any = parts.pop()?.split(';').shift() || null;
    return JSON.parse(parse)
  }
  return null;
}
export async function deleteCookie(name:string) {
  document.cookie = name + '=; Max-Age=0; path=/';
}
export function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
} 
export function decodeBase64(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}



export const getDefaultCompay=async()=>{
        console.log("apiUrl   ",apiUrl)
        console.log("token   ",token) 
    return await api.get("company").then((res)=>{
        console.log("getDefaultCompay res ",res)
        return res.data
    }).catch((err)=>{
        console.log("getDefaultCompay err ",err)
        return null
    })
}

//userlineid
export const userLineid=async(lineid:any)=>{
        console.log("apiUrl   ",apiUrl)
        console.log("token   ",token) 
    return await api.post("userlineid",{lineId: lineid}).then((res)=>{ 
        if(typeof res.data == "string"){
            return JSON.parse(res.data)
        }else{
            return res.data
        }
    }).catch((err)=>{
        console.log("userLineid err ",err)
        return null
    })
}
///villageoption
export const villageoption=async(companyid:any)=>{ 
    return await api.post("villageoption",{companyId: companyid}).then((res)=>{
        console.log("userLineid res ",res)
        return res.data
    }).catch((err)=>{
        console.log("userLineid err ",err)
        return null
    })
}

export const registerNewMember=async(form:any)=>{
    return await api.post("registernewvillager", form ).then((res)=>{  
       return res.data 
    }).catch((err)=>{
        console.log("registerNewMember err ",err)
        return {result:false}
    })
}
export const updatevillager=async(form:any)=>{
    return await api.post("updatevillager", form ).then((res)=>{  
       return res.data 
    }).catch((err)=>{
        console.log("updatevillager err ",err)
        return {result:false}
    })
}
 
export const villageuser=async(form:any)=>{
    return await api.post("villageuser", form ).then((res)=>{  
       return res.data 
    }).catch((err)=>{
        console.log("villageuser err ",err)
        return null
    })
}

export const createComplaint=async(form:any)=>{
    return await api.post("complaint/create",form).then((res)=>{
        console.log("createComplaint res ",res)
        return res.data
    }).catch((err)=>{
        console.log("createComplaint err ",err)
        return {result:false , description: err?.message}
    })
}

//
export const complaintbyuser=async(form:any)=>{
    return await api.post("complaintbyuser",form).then((res)=>{
        console.log("complaintbyuser res ",res)
        return res.data
    }).catch((err)=>{
        console.log("complaintbyuser err ",err)
        return {result:false , description: err?.message}
    })
}
///complaintsumbyuser 
export const complaintsumbyuser=async(form:any)=>{
    return await api.post("complaintsumbyuser",form).then((res)=>{
        console.log("complaintsumbyuser res ",res)
        return res.data
    }).catch((err)=>{
        console.log("complaintsumbyuser err ",err)
        return null
    })
}
//activity
export const activity=async(form:any)=>{
    return await api.post("activity",form).then((res)=>{
        console.log("activity res ",res)
        return res.data
    }).catch((err)=>{
        console.log("activity err ",err)
        return []
    })
}



//companydetail
export async function companydetail(form:any) {
   try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "companydetail",form , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}

//policyandterms
export async function policyandterms() {
   try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "policyandterms" , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}


export default {}