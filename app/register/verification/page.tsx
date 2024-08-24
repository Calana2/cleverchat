"use client"

import { useRouter, useSearchParams } from "next/navigation"
import LoadingScreen from "@/components/loadingScreen"
import { socket } from "@/socket"
import { useState } from "react"
if(!socket.connected){
  socket.connect()
}


export default function Page() {
  async function verify(formData: FormData) {
    const res: any = await fetch("../../api/register/verification", {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.status == 200) {
      setErrorMessage(null)
      router.push('/login')
    } else {
      setErrorMessage(data.statusText)
    }
    setPending(false)
    setLoading(false)
  }

  async function forward(formData: FormData) {
    await fetch("/api/register/verification-forwarding", {
      method: 'PUT',
      body: formData
    })
    setForwarded("sended")
    setTimeout(() => {
      setForwarded("normal")
    }, 3000)
  }


  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, setPending] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [forwarded, setForwarded] = useState<string>("normal")
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") as string


  return (
    <main className="page p-5">
      <h1 className="text-medium font-medium">Se ha enviado un código de verificación a su correo electrónico, introdúzcalo para verificar su cuenta:</h1>


      {/* Verify form */}
      <form action={(f:any)=>{
        setLoading(true)
        setPending(true)
        verify(f)
      }} className="flex flex-col gap-5">
        <input type="text" name="code" placeholder="" className="p-1 border-2 border-gray-300 rounded-md" />
        <input aria-hidden aria-readonly type="text" name="email" value={email} readOnly className="hidden" />
        <button type="submit" disabled={pending} className={`p-2 ${pending ? 'bg-blue-200' : 'bg-blue-500'} 
    rounded-md text-white font-medium md:w-1/2 mx-auto`} aria-disabled={pending}>
          Verificar
        </button>
      </form>


      {/* Forwarding  form */}
      <form action={(f: any) => {
        setLoading(true)
        setPending(true)
        forward(f)
      }}>
        <input aria-hidden aria-readonly type="text" name="email" value={email} readOnly className="hidden" />
        <button type="submit" disabled={pending} onClick={() => { setForwarded('sending') }}
          className="text-base font-medium hover:text-blue-500 border-b-2 border-blue-900 text-blue-900">
          {forwarded === "normal" ?
            'Reenviar código' : forwarded === "sending" ?
              'Enviando...' : 'Enviado'}
        </button>
      </form>


      {/* Error panel and loading screen */}
      <div>{errorMessage && <p className="errorPanel">{errorMessage}</p>}</div>
      {loading ? <LoadingScreen /> : ""}
    </main>
  )
}
