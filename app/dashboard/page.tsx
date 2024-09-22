"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"
import appLogo from "@/public/appLogo.png"
import { socket } from "@/socket"

interface UserList {
  [uid: string]: string
}

export default function Page() {
  const [users, setUsers] = useState<UserList[]>([])
  const [cookies, setCookies] = useState<string>("")


  useEffect(() => {
    setCookies(document.cookie)
    if (socket.connected) {
      onConnect()
    }

    async function onConnect() {
      socket.emit("countMe", {})
    }

    socket.on("updateUserList", (data) => {
      setUsers(data)
    })
    socket.on("connect", onConnect);

    return () => {
      socket.off("connect")
      socket.off("updateUserList")
    }
  }, [])

  return (
    <main className="page md:w-full h-full pb-10 flex">

      {/* section 1 */}
      <div className="w-full h-10 bg-blue-500"></div>
      <div className="flex flex-col md:flex-row gap-5 items-center p-5">
        <Image className="border-2 border-neutral-600"
          src={appLogo} alt="logo" width={300} height={200} />
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-center text-blue-900
         md:w-1/2 break-words">
          CleverChat es un aplicación conversacional creada con Next.js y Socket.io
        </h1>
      </div>


      {/* section 2 */}
      <div className="p-5 flex flex-col gap-2 md:text-2xl">
        <h2 className="bg-blue-500 text-white rounded-md text-lg font-semibold p-2 pl-5  mb-2"> Habitaciones disponibles </h2>
        <ul className="ml-8 list-disc text-blue-700 grid grid-cols-2 md:grid-cols-5">
          <li>
            <Link href="/rooms/global" className="hover:cursor-pointer hover:text-blue-500">
              Chat Libre
            </Link>
          </li>
          <li>
            <Link href="/rooms/advice" className="hover:cursor-pointer hover:text-blue-500">
              Consejos
            </Link>
          </li>
          <li>
            <Link href="/rooms/humor" className="hover:cursor-pointer hover:text-blue-500">
              Humor
            </Link>
          </li>
        </ul>
      </div>


      {/* section 3 */}
      <div className="p-5">
        <h3 className="bg-blue-500 text-white rounded-md text-lg font-semibold p-2 pl-5 mb-2">Estadísticas</h3>

        <p className="text-blue-900 font-semibold">{`Número de usuarios activos: ${users}`}
      {/* The number could not be the correct one*/}
        </p>

      </div>

      <div className="p-5 flex">
        {cookies && !cookies.includes('CLEVER_CHAT_TOKEN') ?
          (<p className="text-blue-900 font-semibold border p-1 border-blue-900">
            Necesita iniciar sesión para iniciar una cuenta
          </p>) : ""
        }
      </div>
    </main>)
}  
