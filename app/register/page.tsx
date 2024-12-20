"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { socket } from "@/socket"
if(!socket.connected){
  socket.connect()
}

import LoadingScreen from "@/components/loadingScreen"

export default function Page() {
  async function register(formData: FormData) {
    const res: any = await fetch("../api/register", {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.status == 200) {
      setErrorMessage(null)
      router.push(`/register/verification?email=${data.email}`)
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
      {/* Register form */}
      <form action={(f: any) => {
        setPending(true)
        setLoading(true)
        register(f)
      }} className="flex flex-col gap-5">
        <input type="text" name="name" placeholder="Usuario" className="p-1 border-2 border-gray-300 rounded-md" />
        <input type="password" name="password" placeholder="Contraseña" className="p-1 border-2 border-gray-300 rounded-md" />
        <input type="password" name="repeatedPassword" placeholder="Repita su contraseña" className="p-1 border-2 border-gray-300 rounded-md" />
        <input type="text" name="email" placeholder="Correo electrónico" className="p-1 border-2 border-gray-300 rounded-md" />
        <button type="submit" className={`p-2 ${pending ? 'bg-blue-200' : 'bg-blue-500'} 
    rounded-md text-white font-medium`}
          disabled={pending} aria-disabled={pending}>
          Registrarse
        </button>
      </form>


      {/* Error panel and loading screen */}
      <div>{errorMessage && <p className="errorPanel">{errorMessage}</p>}</div>
      {loading ? <LoadingScreen /> : ""}
    </main>
  )
}
