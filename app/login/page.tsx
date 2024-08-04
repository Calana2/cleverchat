"use client"

import { useState } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import LoadingScreen from "@/components/loadingScreen"


export default function Page() {
  async function authenticate(formData: FormData) {
    const res: any = await fetch("/api/login", {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.status == 200) {
      setErrorMessage(null)
      redirect('/')
    } else {
      setErrorMessage(data.statusText)
    }
      setLoading(false)
      setPending(false)
  }

  function handleClick(_: React.MouseEvent<HTMLButtonElement> | any) {
    setPending(true)
    setLoading(true)
  }

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, setPending] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <main className="mx-auto w-11/12 md:w-1/4 mt-20 flex flex-col gap-3 p-5 border-2 shadow-md rounded-md">
      <h2 className="text-2xl text-center">Inicio de Sesión</h2>


      {/* Login form */}
      <form action={authenticate} className="flex flex-col gap-5">
        <input type="text" name="name" placeholder="Usuario" className="p-1 border-2 border-gray-300 rounded-md" />
        <input type="password" name="password" placeholder="Contraseña" className="p-1 border-2 border-gray-300 rounded-md" />
        <button type="submit" className={`p-2 ${pending ? 'bg-blue-200' : 'bg-blue-500'} 
    rounded-md text-white font-medium`} onClick={handleClick}
          disabled={pending} aria-disabled={pending}>
          Enviar
        </button>
      </form>


      {/* Link to recovery */}
      <Link href="/login/password-recovery"
        className="mt-5 text-base font-medium hover:text-blue-500 border-b-2">
        Reestablecer contraseña
      </Link>


      {/* Error panel and loading screen */}
      <div>{errorMessage && <p className="errorPanel">{errorMessage}</p>}</div>
      {loading ? <LoadingScreen /> : ""}
    </main>
  )
}
