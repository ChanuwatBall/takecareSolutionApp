import axios from "axios"; 
const apiUrl = import.meta.env.VITE_API;
const token = import.meta.env.VITE_TOKEN;


const api = axios.create({
    baseURL: apiUrl+"/api/liffapp"  ,
    headers: {
        Authorization: "Bearer "+token ,
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

export default {}