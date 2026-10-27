import ListPage from '../components/ListPage'
const F=[{k:'num',label:'Module number',type:'number'},{k:'title',label:'Title'},{k:'summary',label:'Summary',type:'textarea'},{k:'syllabus',label:'Complete syllabus',type:'textarea'},{k:'notes',label:'Notes and study materials',type:'textarea'},{k:'video',label:'YouTube URL',type:'url'},
{k:'cover',label:'Cover image',type:'file',exts:['png','jpg','jpeg','webp'],max:5},{k:'pdf',label:'PDF notes',type:'file',exts:['pdf'],max:25},{k:'ppt',label:'PPT/PPTX',type:'file',exts:['pptx','ppt'],max:25}]
export default function Modules(){return <ListPage col="modules" title="Modules" fields={F} to={i=>`/modules/${i.id}`}/>}
