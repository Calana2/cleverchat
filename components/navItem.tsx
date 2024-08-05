import Link from "next/link"
import {HomeIcon} from "@heroicons/react/24/solid"

export default function NavItem({text, url}:{text: string, url:string}) {

 return (
  <div className="p-2 text-center hover:cursor-pointer md:text-base text-sm text-white"
   style={{fontWeight:"500"}}>
   { text.includes('HomeIcon') ? 
     (<Link href={url}><HomeIcon width={24}/></Link>) :
     (<Link href={url}>{text}</Link>)
   }
  </div>
 )
}
