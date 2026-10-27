import DocForm from '../components/DocForm'
import {useDocData,fmtSize} from '../hooks'
import {useApp} from '../context'
const F=[{k:'intro',label:'Introduction',type:'textarea'},{k:'skills',label:'Skills',type:'textarea'},{k:'education',label:'Education',type:'textarea'},{k:'projects',label:'Projects',type:'textarea'},{k:'certs',label:'Certifications',type:'textarea'},{k:'github',label:'GitHub URL'},{k:'pdf',label:'Resume PDF',type:'file',exts:['pdf'],max:10}]
export default function Resume(){const d=useDocData('settings','resume'),{isAdmin}=useApp()
  return <div className="space-y-4"><h2 className="text-2xl font-bold">Resume</h2>
  {[['About',d?.intro],['Skills',d?.skills],['Education',d?.education],['Projects',d?.projects],['Certifications',d?.certs]].map(([a,b])=>b&&<div key={a} className="glass p-4"><h3 className="font-semibold">{a}</h3><p className="whitespace-pre-wrap">{b}</p></div>)}
  {d?.github&&<a className="btn" href={d.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
  {d?.pdf?.url&&<div className="glass space-y-2 p-4"><p>{d.pdf.name} ({fmtSize(d.pdf.size)}) <a className="btn ml-2" href={d.pdf.url} download target="_blank" rel="noopener noreferrer">Download</a></p><iframe title="Resume" src={d.pdf.url} className="h-[70vh] w-full rounded-lg"/></div>}
  {isAdmin&&<div className="glass p-4"><h3 className="mb-2 font-semibold">Edit resume</h3><DocForm col="settings" id="resume" fields={F}/></div>}</div>}
