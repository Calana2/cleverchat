import { prisma } from "@/prisma/prisma"
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
    if (err instanceof Error) {
      return NextResponse.json({ statusText: err.message }, {status:500})
    } else {
      return NextResponse.json({ statusText: "Error interno del servidor" }, {status:500})
    }
  }
      return NextResponse.json({ statusText: "Error interno del servidor" },{status:500})
}





