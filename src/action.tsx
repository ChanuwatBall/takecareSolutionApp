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

export const createComplaint=async(form:any,header: any)=>{
    return await api.post("complaint/create",form, { 
      headers: header
    }).then((res)=>{
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
 
///complaintid/id
export const complaintid=async({body , id}:any)=>{
    return await api.post("complaintid",body,{
      params:{id: id}
    }).then((res)=>{
        console.log("complaintid res ",res)
        return res.data
    }).catch((err)=>{
        console.log("complaintid err ",err)
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



type CookieOptions = {
  days?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean; // required if sameSite=None
  domain?: string;
};



export function getStorage(keyStore: any) {
  try {
    let value = localStorage.getItem(keyStore);
    return JSON.parse(value||'');
  } catch {
    return "";
  }
}

export function setStorage(keyStore: any, valueStore: any) {
  try {
    localStorage.setItem(keyStore, JSON.stringify(valueStore));
    console.log("set done");
  } catch {
    return "";
  }
}
 


export function setCookie(name: string, value: unknown, opts: CookieOptions = {}) {
  const {
    days = 365,
    path = '/',
    sameSite = 'Lax',
    secure = false,
    domain,
  } = opts;

  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);

  // Encode JSON so Safari/iOS won’t break it
  const encoded = encodeURIComponent(JSON.stringify(value));

  let cookie = `${name}=${encoded}; expires=${d.toUTCString()}; path=${path}; SameSite=${sameSite}`;
  if (secure) cookie += `; Secure`;
  if (domain) cookie += `; Domain=${domain}`;

  document.cookie = cookie;
}

export function getCookie<T = unknown>(name: string): T | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length < 2) return null;

  // Grab the raw encoded cookie value
  let raw = parts.pop()!.split(';').shift() ?? '';

  // Some Safari builds wrap values in quotes — trim them
  if (raw.startsWith('"') && raw.endsWith('"')) {
    raw = raw.slice(1, -1);
  }

  try {
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded) as T;
  } catch (e) {
    // If parsing fails, the cookie might be corrupt or not JSON
    console.warn('Failed to parse cookie', e);
    return null;
  }
}

export function deleteCookie(name: string, path: string = '/') {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}