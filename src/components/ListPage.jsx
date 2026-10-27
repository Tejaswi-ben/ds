import {useMemo,useState} from 'react'
import {Link} from 'react-router-dom'
import {api,changed,upload} from '../api'
import Video from './Video'
import {useCol,fmtSize,ytEmbed} from '../hooks'
import {useApp} from '../context'
export default function ListPage({col,title,fields,filter,to,href,empty={}}){
  const {isAdmin,notify}=useApp(),all=useCol(col),[q,setQ]=useState(''),[cat,setCat]=useState(''),[sort,setSort]=useState('num'),[ed,setEd]=useState(null),[pv,setPv]=useState(null),[busy,setBusy]=useState(false)
  const items=useMemo(()=>(all||[]).filter(i=>!filter||i[filter.k]===filter.v).filter(i=>(i.title+' '+(i.desc||'')).toLowerCase().includes(q.toLowerCase())&&(!cat||i.category===cat))
    .sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):(+a.num||0)-(+b.num||0)),[all,filter,q,cat,sort])
  const cats=[...new Set((all||[]).map(i=>i.category).filter(Boolean))]
  const save=async e=>{e.preventDefault();if(!ed.title?.trim())return notify('Title is required',1);setBusy(true)
    try{const o={...ed};delete o.id
      for(const f of fields)if(f.type==='file'&&ed[f.k] instanceof File){const r=await upload(ed[f.k],col,f.exts,f.max);o[f.k]=f.exts[0]==='png'?r.url:r}
      if(filter)o[filter.k]=filter.v
      
      await (ed.id?api(`/api/${col}/${ed.id}`,'PUT',o):api(`/api/${col}`,'POST',o));changed()
      notify('Saved');setEd(null)}catch(er){notify(er.message,1)}setBusy(false)}
  const del=async i=>{if(confirm(`Delete "${i.title}"? This cannot be undone.`)){try{await api(`/api/${col}/${i.id}`,'DELETE');changed();notify('Deleted')}catch(er){notify(er.message,1)}}}
  return <section><div className="mb-4 flex flex-wrap items-center gap-2"><h2 className="mr-auto text-2xl font-bold">{title}</h2>
    <input className="inp !w-44" aria-label="Search" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/>
    {cats.length>0&&<select className="inp !w-auto" aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All</option>{cats.map(c=><option key={c}>{c}</option>)}</select>}
    <select className="inp !w-auto" aria-label="Sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="num">By number</option><option value="title">By title</option></select>
    {isAdmin&&<button className="btn" onClick={()=>setEd({...empty})}>+ Add</button>}</div>
  {all===null?<p>Loading…</p>:items.length===0?<p className="glass p-6 text-center">Nothing here yet.</p>:
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(i=>{const img=i.cover?.url||i.cover||i.image
    const Wrap=({children})=>href?<a href={href(i)} target="_blank" rel="noopener noreferrer">{children}</a>:to?<Link to={to(i)}>{children}</Link>:<div>{children}</div>
    return <article key={i.id} className="glass overflow-hidden transition hover:-translate-y-1">
      <Wrap>{img?<img src={img} alt="" className={col==='tools'?'h-36 w-full bg-white object-contain p-6':'h-36 w-full object-cover'} onError={e=>{e.target.onerror=null;e.target.src='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect width="200" height="100" fill="#EFF6FF"/><text x="100" y="65" font-size="48" text-anchor="middle" fill="#2563EB" font-family="sans-serif">${(i.title||'?')[0]}</text></svg>`)}}/>:<div className="grid h-36 place-items-center bg-sky-50 text-4xl dark:bg-slate-800">{(i.title||'?')[0]}</div>}
      <div className="p-4"><p className="text-xs text-primary">{i.num&&`#${i.num} `}{i.category}</p><h3 className="font-semibold">{i.title}</h3><p className="line-clamp-3 text-sm opacity-80">{i.desc||i.summary}</p>{href&&<p className="mt-2 text-sm font-medium text-primary">Open tool ↗</p>}</div></Wrap>
      <div className="space-y-1 px-4 pb-4 text-sm">{col==='modules'&&<Video url={i.video}/>}{['pdf','ppt'].map(k=>i[k]?.url&&<div key={k} className="flex flex-wrap items-center gap-2"><span>📎 {i[k].name} ({fmtSize(i[k].size)})</span><a className="text-primary underline" href={i[k].url} download target="_blank" rel="noopener noreferrer">Download</a>
        {k==='pdf'&&<button className="text-primary underline" onClick={()=>setPv(i.pdf)}>Preview</button>}</div>)}
      {isAdmin&&<div className="flex gap-2 pt-1"><button className="btn2" onClick={()=>setEd(i)}>Edit</button><button className="btn2 text-red-600" onClick={()=>del(i)}>Delete</button></div>}</div></article>})}</div>}
  {ed&&<div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><form onSubmit={save} className="glass !bg-white dark:!bg-slate-900 max-h-[90vh] w-full max-w-lg space-y-3 overflow-auto p-5">
    <h3 className="font-bold">{ed.id?'Edit':'Add'} {title}</h3>
    {fields.map(f=><label key={f.k} className="block text-sm">{f.label}
      {f.type==='textarea'?<textarea className="inp" rows={4} value={ed[f.k]||''} onChange={e=>setEd({...ed,[f.k]:e.target.value})}/>
      :f.type==='file'?<><input className="inp" type="file" accept={f.exts.map(t=>'.'+t).join(',')} onChange={e=>setEd({...ed,[f.k]:e.target.files[0]})}/>{ed[f.k]?.name&&!(ed[f.k] instanceof File)&&<span className="text-xs">Current: {ed[f.k].name}</span>}</>
      :<input className="inp" type={f.type||'text'} value={ed[f.k]||''} onChange={e=>setEd({...ed,[f.k]:e.target.value})}/>}</label>)}
    <div className="flex gap-2"><button className="btn" disabled={busy}>{busy?'Saving…':'Save'}</button><button type="button" className="btn2" onClick={()=>setEd(null)}>Cancel</button></div></form></div>}{pv&&<div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={()=>setPv(null)}><div className="glass !bg-white dark:!bg-slate-900 flex h-[90vh] w-full max-w-4xl flex-col p-3" onClick={e=>e.stopPropagation()}><div className="mb-2 flex items-center justify-between gap-2"><span className="truncate text-sm">{pv.name}</span><div className="flex gap-2"><a className="btn2" href={pv.url} download target="_blank" rel="noopener noreferrer">Download</a><button className="btn" onClick={()=>setPv(null)}>Close</button></div></div><iframe title="PDF preview" src={pv.url} className="w-full flex-1 rounded-lg border"/></div></div>}</section>}
