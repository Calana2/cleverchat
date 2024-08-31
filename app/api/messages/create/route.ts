import { FDToObject } from "@/lib";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    console.log(form)
    const data = FDToObject(form)

    const user = await prisma.users.findUnique({
      where: {
        email: data.email
      }
    })

    const room = await prisma.rooms.findUnique({
      where: {
        name: data.room,
      }
    })

    if (!user || !room) {
      throw new Error("Usuario y/o habitacion no encontrada")
    }

    const message = await prisma.messages.create({
      data: {
        creatorId: user?.id as number,
        roomId: room?.id as number,
        body: data.message,
      }
    })

    return NextResponse.json({ databaseId: message.id }, { status: 200 })
  } catch (err: any) {
    console.log(err)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P1001':
          return Response.json({ statusText: "Error al intentar acceder a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P1002':
          return Response.json({ statusText: "Tiempo excedido accediendo a la base de datos, pruebe de nuevo" }, { status: 500 })
        default:
          return Response.json({ statusText: "Error relacionado con la base de datos" }, { status: 500 })
      }
    } else if (err instanceof Error) {
      return NextResponse.json({ statusText: err.message }, { status: 500 })
    } else {
      return NextResponse.json({ statusText: "Error interno del servidor" }, { status: 500 })
    }
  }

}
