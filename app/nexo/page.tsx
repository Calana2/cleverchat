"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"
import appLogo from "@/public/appLogo.png"
import { socket } from "@/socket"

export default function Page() {
  const [users, setUsers] = useState<any>(0)
  const [cookies, setCookies] = useState<string>("")


  useEffect(() => {
    setCookies(document.cookie)
    if (socket.connected) {
      onConnect()
    }

    async function onConnect() {
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
    <main className="page md:w-3/4 h-4/5 flex mb-10">

      {/* section 1 */}
      <div className="w-full h-10 bg-blue-500"></div>
      <div className="flex flex-col md:flex-row gap-5 items-center p-5">
        <Image className="border-2 border-neutral-600"
          src={appLogo} alt="logo" width={300} height={200} />
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-center text-blue-900
         md:w-1/2 break-words">
          CleverChat es un aplicación conversacional creada con Next.js y Socket.io como proyecto personal
        </h1>
      </div>


      {/* section 2 */}
      <div className="p-5 flex flex-col gap-2">
        <h2 className="bg-blue-500 text-white rounded-md font-semibold p-2 pl-5  mb-2"> Habitaciones disponibles </h2>
        <div className="ml-8 text-blue-700 grid grid-cols-1 md:grid-cols-3 gap-2">
            <Link href="/rooms/global" className="hover:cursor-pointer hover:text-blue-500 
             md:text-lg font-bold">
              <span className="bg-blue-100 p-1 rounded-md shadow-md">Chat Libre</span>
            </Link>
            <Link href="/rooms/advice" className="hover:cursor-pointer hover:text-blue-500 
             md:text-lg font-bold">
              <span className="bg-blue-100 p-1 rounded-md shadow-md">Consejos</span>
            </Link>
            <Link href="/rooms/humor" className="hover:cursor-pointer hover:text-blue-500 
             md:text-lg font-bold">
              <span className="bg-blue-100 p-1 rounded-md shadow-md">Humor</span>
            </Link>
         </div>
      </div>


      {/* section 3 */}
      <div className="p-5">
        <h3 className="bg-blue-500 text-white rounded-md text-lg font-semibold p-2 pl-5 mb-2">Estadísticas</h3>

        <p className="text-blue-900 font-semibold pl-5">
        Número de usuarios activos:  {users ? users : ""}   
      {/* The number could not be the correct one, this was the nicest approach i was able to get */}
        </p>

      </div>

      <div className="p-5 flex">
        {cookies && !cookies.includes('CLEVER_CHAT_TOKEN') ?
          (<p className="text-blue-900 font-semibold border p-1 border-blue-900">
            Necesita iniciar sesión para iniciar una cuenta
          </p>) : ""
        }
      </div>

      <footer className="bg-blue-500 text-center">
       <div className="text-white bg-blue-500 py-4 text-lg font-bold shadow-md rounded-md">
       Contact: kalcast00@proton.me</div>
      </footer>
    </main>)
}  
