import {useEffect,useState} from 'react'
import {api,changed,upload} from '../api'
import {useDocData} from '../hooks'
import {useApp} from '../context'
export default function DocForm({col,id,fields,onDone}){
  const d=useDocData(col,id),{notify}=useApp(),[f,setF]=useState({}),[busy,setBusy]=useState(false)
  useEffect(()=>{if(d!==null)setF(d||{})},[d])
  const save=async e=>{e.preventDefault();setBusy(true)
    try{const o={...f};delete o.id
      for(const x of fields)if(x.type==='file'&&f[x.k] instanceof File)o[x.k]=await upload(f[x.k],col,x.exts,x.max)
      await api(`/api/${col}/${id}`,'PUT',o);changed();notify('Saved');onDone?.()}catch(er){notify(er.message,1)}setBusy(false)}
  return <form onSubmit={save} className="space-y-3">{fields.map(x=><label key={x.k} className="block text-sm">{x.label}
    {x.type==='textarea'?<textarea className="inp" rows={3} value={f[x.k]||''} onChange={e=>setF({...f,[x.k]:e.target.value})}/>
    :x.type==='file'?<input className="inp" type="file" accept={x.exts.map(t=>'.'+t).join(',')} onChange={e=>setF({...f,[x.k]:e.target.files[0]})}/>
    :<input className="inp" type="text" value={f[x.k]||''} onChange={e=>setF({...f,[x.k]:e.target.value})}/>}
    {x.type==='file'&&f[x.k]?.name&&!(f[x.k] instanceof File)&&<span className="text-xs">Current: {f[x.k].name}</span>}</label>)}
    <button className="btn" disabled={busy}>{busy?'Saving…':'Save'}</button></form>}
