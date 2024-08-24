"use client"
import { useState, useEffect } from "react"
import NavItem from "./navItem";
import Image from "next/image";
import message from "@/public/message-30.png"

type LinkItem = {
  text: string
  url: string
}

const ITEMS: LinkItem[] = [
  { text: "HomeIcon", url: "/dashboard" },
  { text: "UserIcon", url: "/"},
  { text: "Iniciar Sesión", url: "/login" },
  { text: "Registrarse", url: "/register" },
]

export default function NavBar() {
  const [screenWidth, setScreenWidth] = useState(0);
  const medium = "px-5 top-0 w-full justify-end md:p-2"
  const small = "px-5 top-0 w-full justify-end p-1"

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);




  return (
    <nav className={`absolute w-full bg-blue-500 shadow-md border-b ${screenWidth < 768 ? small : medium}`}>
      <div className="md:flex justify-between items-center">
        <div className="flex md:gap-2">
          <span className="text-white md:text-3xl text-lg font-bold"
           style={{letterSpacing:"0.3rem"}}>
            CleverChat
          </span>
          <Image src={message} alt="icon" />
        </div>
       {/* good for now, i'll change it if it's necesary*/}
        <div className={`${screenWidth < 768 
          ? "flex items-center gap-2" 
           : "flex items-center gap-2"
          }`}>
          {screenWidth == 0 ? null : ITEMS.map((item, index) => (<div key={index}><NavItem text={item.text} url={item.url} /></div>))}
        </div>
      </div>

    </nav>
  )
}
