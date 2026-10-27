const BASE=import.meta.env.VITE_API_URL||'http://localhost:4000'
const hdr=j=>({...(j&&{'Content-Type':'application/json'}),...(localStorage.dslToken&&{Authorization:'Bearer '+localStorage.dslToken})})
export async function api(path,method='GET',body){
  const r=await fetch(BASE+path,{method,headers:hdr(body),body:body&&JSON.stringify(body)})
  if(r.status===404)return null
  if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||'Request failed ('+r.status+')')
  return r.json()}
export const changed=()=>window.dispatchEvent(new Event('dsl-change'))
export async function upload(file,folder,exts,maxMB=25){
  const ext=file.name.split('.').pop().toLowerCase()
  if(!exts.includes(ext))throw new Error(`Allowed types: ${exts.join(', ')}`)
  if(file.size>maxMB*1048576)throw new Error(`File exceeds ${maxMB} MB`)
  const fd=new FormData();fd.append('file',file)
  const r=await fetch(BASE+'/api/upload',{method:'POST',headers:hdr(false),body:fd})
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Upload failed')
  return {...j,url:BASE+j.url}}
