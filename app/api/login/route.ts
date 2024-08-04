import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/types"
import { FDToObject, createJWT, generateNisse } from "@/lib"
import { prisma } from "@/prisma/prisma";
import { cookies } from "next/headers"
const bcrypt = require("bcrypt")
type recovery_put = { email: string, password: string, repeatedPassword: string }


export async function POST(req: NextRequest) {
  try {
    var data: FormData
    data = await req.formData()
    var user: User
    user = FDToObject(data)

    // Zod validation
    const userSchema = z.object({
      name: z.string().min(1, { message: "El campo de nombre no puede estar vacío" }),
      password: z.string().min(1, { message: "El campo de contraseña no puede estar vacío" }),
    })

    userSchema.parse(user)

    // Verify if user exists 
    const res = await prisma.users.findMany({
      where: {
        name: user.name,
      }
    })


    let matched = null
    for (const t of res) {
      const isValid = bcrypt.compareSync(user.password, t.password)
      if (isValid) {
        matched = t
      }
    }

    if (matched) {
      if (matched.verified) {
        const nisseName: string = generateNisse()
        const token = await createJWT({ name: user.name, role: 'user', yourNisseIs: nisseName })
        cookies().set("CLEVER_CHAT_TOKEN", token, { maxAge: 7 * 24 * 60 * 60, sameSite: "lax" })
        return NextResponse.json({ status: 200 })
      } else {
        throw new Error("Correo no verificado")
      }
    }
    throw new Error("Usuario y contraseña incorrectos")

  } catch (err: any) {
    console.log(err)

    if (err instanceof z.ZodError) {
      const zodError = err as z.ZodError
      return NextResponse.json({ status: 500, statusText: zodError.message })
    } else if (err instanceof Error) {
      return NextResponse.json({ status: 500, statusText: err.message })
    } else {
      return NextResponse.json({ status: 500, statusText: "Error interno del servidor" })
    }
  } // catch
}



