import {useEffect,useState} from 'react'
import {api} from './api'
const useLive=(path,map)=>{const[d,s]=useState(null);useEffect(()=>{let ok=true
  const load=()=>api(path).then(x=>ok&&s(map(x)),()=>ok&&s(map(null)));load()
  window.addEventListener('dsl-change',load);return()=>{ok=false;window.removeEventListener('dsl-change',load)}},[path]);return d}
export const useCol=n=>useLive('/api/'+n,x=>x||[])
export const useDocData=(c,id)=>useLive(`/api/${c}/${id}`,x=>x||false)
export const ytEmbed=u=>{const m=(u||'').trim().match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#\s]*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/);return m?`https://www.youtube.com/embed/${m[1]}`:null}
export const fmtSize=b=>b>1048576?(b/1048576).toFixed(1)+' MB':Math.ceil(b/1024)+' KB'
