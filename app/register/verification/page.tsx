"use client"

import { useState } from "react"
import { redirect, useSearchParams } from "next/navigation"
import LoadingScreen from "@/components/loadingScreen"


export default function Page() {
  async function verify(formData: FormData) {
    const res: any = await fetch("/api/register/verification", {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.status == 200) {
      setErrorMessage(null)
      redirect('/login')
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

  function handleClick(_: React.MouseEvent<HTMLButtonElement> | any) {
    setLoading(true)
    setPending(true)
  }

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, setPending] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [forwarded, setForwarded] = useState<string>("normal")
  const searchParams = useSearchParams()
  const email = searchParams.get("email") as string


  return (
    <main className="mx-auto w-11/12 md:w-1/3 mt-20 flex flex-col gap-3 p-5 border-2 shadow-md rounded-md">
      <h1 className="text-medium font-medium">Se ha enviado un código de verificación a su correo electrónico, introdúzcalo para verificar su cuenta:</h1>


      {/* Verify form */}
      <form action={verify} className="flex flex-col gap-5">
        <input type="text" name="code" placeholder="" className="p-1 border-2 border-gray-300 rounded-md" />
        <input aria-hidden aria-readonly type="text" name="email" value={email} readOnly className="hidden" />
        <button type="submit" disabled={pending} className={`p-2 ${pending ? 'bg-blue-200' : 'bg-blue-500'} 
    rounded-md text-white font-medium md:w-1/2 mx-auto`} onClick={handleClick} aria-disabled={pending}>
          Verificar
        </button>
      </form>


      {/* Forwarding  form */}
      <form action={forward}>
        <input aria-hidden aria-readonly type="text" name="email" value={email} readOnly className="hidden" />
        <button type="submit" disabled={pending} onClick={() => { setForwarded('sending') }}
          className="text-base font-medium hover:text-blue-500 border-b-2">
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