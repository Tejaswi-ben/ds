import ListPage from '../components/ListPage'
export const EXP_FIELDS=[{k:'num',label:'Number',type:'number'},{k:'title',label:'Title'},{k:'desc',label:'Overview',type:'textarea'},{k:'summary',label:'Summary of concepts',type:'textarea'},
{k:'video',label:'YouTube URL',type:'url'},{k:'github',label:'GitHub repo URL',type:'url'},{k:'cover',label:'Cover image (PNG/JPG)',type:'file',exts:['png','jpg','jpeg','webp'],max:5},{k:'code',label:'Source code',type:'textarea'}]
export default function Experiments(){return <ListPage col="experiments" title="Experiments" fields={EXP_FIELDS} to={i=>`/experiments/${i.id}`}/>}
