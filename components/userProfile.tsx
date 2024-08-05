"use client"

import Image from "next/image";
import { useState, useEffect } from "react"

import { getCookie } from "@/lib"
import { decryptJWT, deleteCookie } from "@/lib/server"
import { UserData } from "@/types"

export default function UserProfile() {

  const setDataWrapper = async () => {
    // get session cookie
    const jwt = getCookie("CLEVER_CHAT_TOKEN")
    const res: any = await decryptJWT(jwt)
    setData(res.payload)
  }

  const [data, setData] = useState<UserData | null>(null)
  const [closed, setClosed] = useState<boolean>(false)
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setDataWrapper()
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Inicializa el ancho al cargar la página

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="absolute top-4 left-4 bg-white rounded-md shadow-md p-4 z-3">
      <div className="flex items-center">
        <Image className="rounded-full" src={`/nisses/${data?.yourNisseIs}.png`} alt="icon"
          width={screenWidth < 768 ? 30 : 40} height={screenWidth < 768 ? 30 : 40} />
        <div className="ml-3 text-gray-800 font-medium">
          {data?.name}
        </div>
      </div>
      <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
      text-sm md:text-base"
        onClick={(e) => {
          let res = deleteCookie("CLEVER_CHAT_TOKEN")
          setClosed(true)
        }}>
        {closed ? 'Sesión cerrada' : 'Cerrar sesión'}
      </button>
    </div>
  )
}
