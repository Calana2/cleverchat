import { ReactNode } from "react"

type Props = {
 text?: string
 className?: string
 child?: ReactNode
}

export default function Announcement({text, className, child}: Props) {
 return (
  <div className={`${className} fixed flex items-center justify-center text-center`}>
   <div>{text}</div>
   {child}
  </div>
 )
}

