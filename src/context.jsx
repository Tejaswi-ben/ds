import {createContext,useContext,useEffect,useState} from 'react'
import {api} from './api'
const Ctx=createContext()
export const useApp=()=>useContext(Ctx)
export function Providers({children}){
  const [dark,setDark]=useState(()=>localStorage.theme?localStorage.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches)
  const [user,setUser]=useState(undefined)
  const [toast,setToast]=useState(null)
  useEffect(()=>{document.documentElement.classList.toggle('dark',dark);localStorage.theme=dark?'dark':'light'},[dark])
  useEffect(()=>{(localStorage.dslToken?api('/api/me').catch(()=>null):Promise.resolve(null)).then(u=>setUser(u?{ok:true}:null))},[])
  const notify=(text,err)=>{setToast({text,err});setTimeout(()=>setToast(null),3500)}
  const login=async(email,password)=>{const r=await api('/api/login','POST',{email,password});localStorage.dslToken=r.token;setUser({ok:true})}
  const logout=()=>{localStorage.removeItem('dslToken');setUser(null)}
  return <Ctx.Provider value={{dark,setDark,user,isAdmin:!!user,login,logout,notify}}>{children}
    {toast&&<div role="status" className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-2 text-white shadow-lg ${toast.err?'bg-red-600':'bg-green-600'}`}>{toast.text}</div>}</Ctx.Provider>
}
