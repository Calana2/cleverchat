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

  useEffect(() => {
    setDataWrapper()
  }, [])

  return (
    <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-4">
      <div className="flex items-center">
        <Image className="rounded-full" src={`/nisses/${data?.yourNisseIs}.png`} alt="icon"
          width={40} height={40} />
        <div className="ml-3 text-gray-800 font-medium">
          {data?.name}
        </div>
      </div>
      <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={(e) => {
          let res = deleteCookie("CLEVER_CHAT_TOKEN")
          setClosed(true)
        }}>
        {closed ? 'Sesión cerrada' : 'Cerrar sesión'}
      </button>
    </div>
  )
}
