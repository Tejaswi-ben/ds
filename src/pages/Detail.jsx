import {Link,useParams} from 'react-router-dom'
import Editor from '@monaco-editor/react'
import ListPage from '../components/ListPage'
import Playground from '../components/Playground'
import Video from '../components/Video'
import {EXP_FIELDS} from './Experiments'
import {useDocData,ytEmbed} from '../hooks'
import {useApp} from '../context'
export default function Detail({kind}){
  const {id,sid}=useParams(),{dark,notify}=useApp(),d=useDocData(kind,sid||id),p=useDocData('experiments',id)
  if(d===null)return <p>Loading…</p>
  if(!d)return <p className="glass p-6">Not found.</p>
  const yt=ytEmbed(d.video),date=d.updatedAt&&new Date(d.updatedAt).toLocaleDateString()
  return <article className="space-y-5"><nav aria-label="Breadcrumb" className="text-sm"><Link to="/" className="text-primary">Home</Link> › <Link to="/" className="text-primary">Experiments</Link>
    {kind==='subexperiments'?<> › <Link className="text-primary" to={`/experiments/${id}`}>Experiment {p?.num}</Link> › Sub-experiment {d.num}</>:<> › Experiment {d.num}</>}</nav>
    {d.cover&&<img src={d.cover.url||d.cover} alt="" className="h-52 w-full rounded-2xl object-cover"/>}
    <h1 className="text-3xl font-bold">{d.num}. {d.title}</h1><p className="text-xs opacity-60">Updated {date||'—'}</p>
    <div className="glass p-4"><h2 className="font-semibold">Overview</h2><p className="whitespace-pre-wrap">{d.desc}</p><h2 className="mt-3 font-semibold">Summary</h2><p className="whitespace-pre-wrap">{d.summary}</p></div>
    <Video url={d.video}/>
    {d.github&&<a className="btn" href={d.github} target="_blank" rel="noopener noreferrer">GitHub repository</a>}
    {d.code&&<div className="glass p-3"><div className="mb-2 flex justify-between"><h2 className="font-semibold">Source code</h2><button className="btn2" onClick={()=>{navigator.clipboard.writeText(d.code);notify('Copied')}}>Copy</button></div>
      <div className="h-64 overflow-hidden rounded-lg"><Editor value={d.code} language="python" theme={dark?'vs-dark':'light'} options={{readOnly:true,minimap:{enabled:false}}}/></div></div>}
    <div><h2 className="mb-2 text-xl font-semibold">Try Yourself</h2><Playground/></div>
    {kind==='experiments'&&<ListPage col="subexperiments" title="Sub-experiments" fields={EXP_FIELDS} filter={{k:'experimentId',v:id}} to={s=>`/experiments/${id}/sub/${s.id}`}/>}</article>}
