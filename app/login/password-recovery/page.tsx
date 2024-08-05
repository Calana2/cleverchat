"use client"

import { useRef, useState } from "react"
import LoadingScreen from "@/components/loadingScreen"


export default function Page() {
  async function forward(formData: FormData) {
    const res: any = await fetch("../../api/login/password-recovery", {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.status == 200) {
      setErrorMessage(null)
      if (inputRef.current)
        inputRef.current.value = ""
      setSended(true)
    } else {
      setErrorMessage(data.statusText)
    }
    setLoading(false)
    setPending(false)
  }


  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, setPending] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sended, setSended] = useState<boolean>(false)

  // step 2
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <main className="page p-5">


      {/* Forwarding form */}
      <h1 className="text-medium font-medium">
        {!sended ?
          "Introduzca su correo para recuperar su contraseña:" :
          "Se ha enviado un enlace de recuperación a su cuenta de correo"
        }
      </h1>
      <form action={(f: any) => {

        setLoading(true)
        setPending(true)
        forward(f)
      }} className="flex flex-col gap-5">
        <input type="text" name="email" placeholder="email" ref={inputRef}
          className="p-1 border-2 border-gray-300 rounded-md" />
        <button type="submit" disabled={pending}
          className={`p-2 ${pending ? 'bg-blue-200' : 'bg-blue-500'} rounded-md text-white font-medium md:w-1/2 mx-auto`}
          aria-disabled={pending}>
          Enviar
        </button>
      </form>


      {/* Error panel and loading screen */}
      <div>{errorMessage && <p className="errorPanel">{errorMessage}</p>}</div>
      {loading ? <LoadingScreen /> : ""}
    </main>
  )
}
