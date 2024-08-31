import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/types"
import { FDToObject, createJWT, generateNisse } from "@/lib"
import { prisma } from "@/prisma/prisma";
import { cookies } from "next/headers"
import { Prisma } from "@prisma/client";
const bcrypt = require("bcrypt")

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
        const token = await createJWT({ name: user.name, role: 'user', yourNisseIs: nisseName, email: matched.email })
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
      const issues = zodError.issues
      return Response.json({ statusText: issues[0].message }, { status: 500 })
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P1001':
          return Response.json({ statusText: "Error al intentar acceder a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P1002':
          return Response.json({ statusText: "Tiempo excedido accediendo a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P1002':
          return Response.json({ statusText: "Tiempo excedido accediendo a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P2002':
          return Response.json({ statusText: "Ya existe una cuenta con ese correo, si es usted y no pudo verificarlo, acceda a: " }, { status: 500 })
        default:
          return Response.json({ statusText: "Error relacionado con la base de datos" }, { status: 500 })
      }
    } else if (err instanceof Error) {
      return NextResponse.json({ statusText: err.message }, { status: 500 })
    } else {
      return NextResponse.json({ statusText: "Error interno del servidor" }, { status: 500 })
    }
  } // catch
}



