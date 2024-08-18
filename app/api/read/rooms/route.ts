import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(req: NextRequest) {

  const token = process.env.API_SECRET
  const url = new URL(req.url)
  const p = url.searchParams.get('token')

  if (p && p === token) {
    try {
      const rooms = await prisma.rooms.findMany({})
      return NextResponse.json(rooms,{ status: 200 })
    } catch (err) {
      console.log(err)
      return NextResponse.json(null,{ status: 500 })
    }
  }
  return NextResponse.json(null,{ status: 403 })
}

