import {Link,useParams} from 'react-router-dom'
import {useDocData,ytEmbed,fmtSize} from '../hooks'
import Video from '../components/Video'
const Sec=({t,v})=>v?<div className="glass p-4"><h2 className="font-semibold">{t}</h2><p className="whitespace-pre-wrap">{v}</p></div>:null
export default function ModuleDetail(){
  const {id}=useParams(),d=useDocData('modules',id)
  if(d===null)return <p>Loading…</p>
  if(!d)return <p className="glass p-6">Module not found.</p>
  const yt=ytEmbed(d.video),img=d.cover?.url||d.cover
  return <article className="space-y-5"><nav aria-label="Breadcrumb" className="text-sm"><Link className="text-primary" to="/">Home</Link> › <Link className="text-primary" to="/modules">Modules</Link> › Module {d.num}</nav>
    {img&&<img src={img} alt="" className="h-52 w-full rounded-2xl object-cover"/>}
    <h1 className="text-3xl font-bold">{d.num}. {d.title}</h1>
    <Sec t="Summary" v={d.summary}/><Sec t="Complete syllabus" v={d.syllabus||d.desc}/><Sec t="Notes and study materials" v={d.notes}/>
    <Video url={d.video}/>
    {(d.pdf?.url||d.ppt?.url)&&<div className="glass space-y-3 p-4"><h2 className="font-semibold">Resources</h2>
      {['pdf','ppt'].map(k=>d[k]?.url&&<p key={k}>📎 {d[k].name} ({fmtSize(d[k].size)}) <a className="btn ml-2" href={d[k].url} download target="_blank" rel="noopener noreferrer">Download</a></p>)}
      {d.pdf?.url&&<iframe title="PDF preview" src={d.pdf.url} className="h-[70vh] w-full rounded-lg border"/>}</div>}</article>}
