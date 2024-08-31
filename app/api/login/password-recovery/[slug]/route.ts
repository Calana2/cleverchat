import { prisma } from "@/prisma/prisma"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
  try {
    const res = await prisma.recuperation.findFirst({
      where: {
        token: req.nextUrl.pathname.split('recovery/')[1]
      }
    })

    console.log(req.nextUrl.pathname.split('recovery/')[1])

    if (res) {
      return NextResponse.json({ status: 200, email: `${res.email}` })
    }

  } catch (err) {
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
    } else {
      return NextResponse.json({ statusText: "Error interno del servidor" }, { status: 500 })
    }
  }
  return NextResponse.json({ statusText: "Error interno del servidor" }, { status: 500 })
}





