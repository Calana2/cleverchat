"use client"

import LoadingScreen from "@/components/loadingScreen"
import { useEffect, useState } from "react"

export default function Page({ params }: { params: { slug: string } }) {

  async function verifyToken() {
    const req = await fetch(`/api/login/password-recovery/${params.slug}`, {
      method: "GET",
    })
    const data = await req.json()

    if (data.status == 200) {
      setErrorMessage(null)
      setIsValid(true)
      setEmail(data.email)
    } else {
      setErrorMessage(data.statusText)
    }
  }


  async function recovery(e: any) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const res: any = await fetch("/api/login/password-recovery/", {
      method: 'PUT',
      body: formData,
    })

    const r = await res.json()
    if (r.status == 200) {
      setErrorMessage(null)
      setRecovered(true)

    } else {
      setErrorMessage(r.statusText)
      setRecovered(false)
    }
    setLoading(false)
    setPending(false)
  }


  function handleClick(_: React.MouseEvent<HTMLButtonElement> | any) {
    setPending(true)
    setLoading(true)
  }


  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [pending, setPending] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [recovered, setRecovered] = useState<boolean>(false)

  useEffect(()=>{
   verifyToken()
  },[])


  return (
    <main className="mx-auto w-11/12 md:w-1/4 mt-20 flex flex-col gap-3 p-5 border-2 shadow-md rounded-md">
      {isValid ?

        (<div><form onSubmit={recovery} className="flex flex-col gap-5">
          <input type="password" name="password" placeholder="Contraseña"
            className="p-1 border-2 border-gray-300 rounded-md" />
          <input type="password" name="repeatedPassword" placeholder="Repita su contraseña"
            className="p-1 border-2 border-gray-300 rounded-md" />
          <input type="email" name="email" readOnly value={email} className="hidden" />
          <button type="submit" onClick={handleClick} disabled={pending} aria-disabled={pending}
            className={`p-2 ${pending ? 'bg-blue-200' : 'bg-blue-500'} 
    rounded-md text-white font-medium`}>
            Reestablecer
          </button>
        </form>
          {recovered ? (<div className="successPanel mt-6">
            Contraseña reestablecida con éxito
          </div>) : ""}
        </div>) : ""
      }
      {errorMessage ? (<div className="errorPanel">{errorMessage}</div>) : ""}
      {loading ? <LoadingScreen /> : ""}
    </main>
  )
}
