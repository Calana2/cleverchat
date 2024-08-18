export default function Announcement(
  {text, color, bg_color}: 
  {text:string, color:string, bg_color: string}) {
 return (
  <div className={`text-${color} bg-${bg_color}`}>
   {text}
  </div>
 )
}
