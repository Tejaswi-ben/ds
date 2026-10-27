import {useState} from 'react'
import DocForm from './DocForm'
import {useDocData} from '../hooks'
import {useApp} from '../context'
export const ID_FIELDS=[['name','Student name'],['roll','Roll number'],['professor','Assistant professor'],['section','Section'],['github','GitHub URL'],['subject','Subject'],['university','University']].map(([k,label])=>({k,label})).concat([{k:'photo',label:'Profile photo (PNG/JPG, max 5 MB)',type:'file',exts:['png','jpg','jpeg','webp'],max:5}])
export default function IdCard(){
  const d=useDocData('settings','idcard'),{isAdmin}=useApp(),[edit,setEdit]=useState(false)
  if(edit)return <div className="glass p-4"><DocForm col="settings" id="idcard" fields={ID_FIELDS} onDone={()=>setEdit(false)}/></div>
  const x=d||{}
  return <div className="glass overflow-hidden"><div className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">{x.university||'University'}</div>
    <div className="space-y-1 p-4 text-sm">{x.photo?.url?<img src={x.photo.url} alt={x.name||'Student photo'} className="mb-2 h-20 w-20 rounded-full object-cover ring-2 ring-primary"/>:<div className="mb-2 grid h-16 w-16 place-items-center rounded-full bg-sky-50 text-2xl dark:bg-slate-800">🎓</div>}
      <p className="text-lg font-bold">{x.name||'Student Name'}</p>
      {[['Roll No',x.roll],['Professor',x.professor],['Section',x.section],['Subject',x.subject]].map(([a,b])=><p key={a}><span className="opacity-60">{a}:</span> {b||'—'}</p>)}
      {x.github&&<a className="text-primary underline" href={x.github} target="_blank" rel="noopener noreferrer">GitHub profile</a>}
      {isAdmin&&<div><button className="btn2 mt-2" onClick={()=>setEdit(true)}>Edit ID card</button></div>}</div></div>}
