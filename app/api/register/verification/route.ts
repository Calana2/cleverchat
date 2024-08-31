import { NextRequest, NextResponse } from "next/server";
import { VerType } from "@/types"
import { FDToObject } from "@/lib"
import { prisma } from "@/prisma/prisma"
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    var data: FormData = await req.formData()
    var userVer: VerType = FDToObject(data) as VerType
    if (!userVer.email) {
      throw new Error("Usuario desconocido")
    }

    const user = await prisma.users.findFirst({
      where: {
        email: userVer?.email
      }
    })

    if (user?.verificationCode === userVer.code) {
      await prisma.users.update({
        where: {
          id: user.id
        },
        data: {
          verified: true,
          verificationCode: "ACCEPTED",
        }
      })
      return NextResponse.json({ status: 200 })
    }
    throw new Error("Codigo de verificacion incorrecto")

  } catch (err: any) {
    console.log(err)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P1001':
          return Response.json({ statusText: "Error al intentar acceder a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P1002':
          return Response.json({ statusText: "Tiempo excedido accediendo a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P2002':
          return Response.json({ statusText: "Restriccion unica encontrada" }, { status: 500 })
        default:
          return Response.json({ statusText: "Error relacionado con la base de datos" }, { status: 500 })
      }
    } else if (err instanceof Error) {
      return NextResponse.json({ statusText: err.message }, { status: 500 })
    }
    return NextResponse.json({ statusText: "Error interno del servidor" }, { status: 500 })
  }
}
