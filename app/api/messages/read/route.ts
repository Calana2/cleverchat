import { prisma } from "@/prisma/prisma";
import { DB_Message } from "@/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    if (req.nextUrl.searchParams.has('room')) { // full message request

      let messages: DB_Message[] = []
      const room = await prisma.rooms.findUnique({
       where: {
        name: req.nextUrl.searchParams.get('room') as string
       }
      })

      if (req.nextUrl.searchParams.has('lastId') && 
          parseInt(req.nextUrl.searchParams.get('lastId') as string,10) > 0) 
      {
        const lid = req.nextUrl.searchParams.get('lastId') as string
        messages = await prisma.messages.findMany({
          where: {
            id: { gt: parseInt(lid, 10) },
            roomId: room?.id,
          }
        })

      } else {
        messages = await prisma.messages.findMany({
         where: {
          roomId: room?.id,
         }
        })
      }
      return NextResponse.json(messages, { status: 200 })

    } else if (req.nextUrl.searchParams.has('id')) {
      const id = req.nextUrl.searchParams.get('id') as string
      const user = await prisma.users.findUnique({
        where: {
          id: parseInt(id, 10)
        }
      })
      return NextResponse.json(user, { status: 200 })
    }

    return NextResponse.json({}, { status: 200 })

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
      return NextResponse.json({ statusMessage: err.message }, { status: 500 })
    } else {
      return NextResponse.json({ statusMessage: "Error desconocido del servidor" },
        { status: 500 })
    }
  }
}
