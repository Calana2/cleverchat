"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LoadingScreen from "@/components/loadingScreen"
import { socket } from "@/socket"
if(!socket.connected){
  socket.connect()
}

export default function Page() {
  async function authenticate(formData: FormData) {
    const res: any = await fetch("../api/login", {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.status == 200) {
      setErrorMessage(null)
      router.push("/")
    } else {
      setErrorMessage(data.statusText)
    }
      setLoading(false)
      setPending(false)
  }


  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, setPending] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()



  return (
    <main className="page p-5 slide-right">
      <h2 className="text-2xl text-center">Inicio de Sesión</h2>


      {/* Login form */}
      <form action={(f:any)=>{
      setLoading(true)
      setPending(true)
      authenticate(f)}}
        className="flex flex-col gap-5">  
        <input type="text" name="name" placeholder="Usuario" className="p-1 border-2 border-gray-300 rounded-md" />
        <input type="password" name="password" placeholder="Contraseña" className="p-1 border-2 border-gray-300 rounded-md" />
        <button type="submit" className={`p-2 ${pending ? 'bg-blue-200' : 'bg-blue-500'} 
    rounded-md text-white font-medium`} 
          disabled={pending} aria-disabled={pending}>
          Enviar
        </button>
      </form>


      {/* Link to recovery */}
      <Link href="/login/password-recovery" onClick={()=>{setLoading(true)}}
        className="mt-5 text-blue-900 font-medium hover:text-blue-500 border-b-2 border-blue-900">
        Restablecer contraseña
      </Link>


      {/* Error panel and loading screen */}
      <div>{errorMessage && <p className="errorPanel">{errorMessage}</p>}</div>
      {loading ? <LoadingScreen /> : ""}
    </main>
  )
}
