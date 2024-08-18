"use client"
import Image from "next/image";
import Link from "next/link";
import {useState} from "react"
import appLogo from "@/public/appLogo.png"
import { socket } from "@/socket"
if(!socket.connected){
  socket.connect()
}

export default function Page() {
const [users,setUsers] = useState<UserList[]>([])

interface UserList {
 [uid: string]: string
}

socket.on("updateUserList",(data)=>{
 setUsers(data)  
})

  return (
    <main className="page md:w-1/2 mb-10 shadow-md">

      {/* section 1 */}
      <div className="w-full h-10 bg-blue-500"></div>
      <div className="flex flex-col md:flex-row gap-5 items-center p-5">
        <Image className="border-2 border-neutral-600"
          src={appLogo} alt="logo" width={200} height={200} />
        <h1 className="text-2xl font-bold font-serif text-center text-blue-900">
          CleverChat es un aplicación conversacional creada con Next.js y Socket.io
        </h1>
      </div>


      {/* section 2 */}
      <div className="p-5 flex flex-col gap-2">
        <h2 className="bg-blue-500 text-white rounded-md text-lg font-semibold p-2 pl-5  mb-2"> Habitaciones disponibles </h2>
        <ul className="ml-4 list-disc text-blue-700">
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

        <span className="text-blue-900 font-semibold">{`Número de usuarios activos: ${Object.keys(users).length} `}
        </span>
      </div>
    </main>)
}  
