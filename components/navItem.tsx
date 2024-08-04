import Link from "next/link"

export default function NavItem({text, url}:{text: string, url:string}) {

 return (
  <div className="bg-blue-500 p-2 rounded-md text-white text-center hover:bg-blue-700 hover:cursor-pointer">
   <Link href={url}>{text}</Link>
  </div>
 )
}
