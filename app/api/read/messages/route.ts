import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(req: NextRequest) {

  const token = process.env.API_SECRET
  const url = new URL(req.url)
  const p = url.searchParams.get('token')

  if (p && p === token) {
    try {
      const messages = await prisma.messages.findMany({})
      return NextResponse.json({ status: 200, messages })
    } catch (err) {
      console.log(err)
      return NextResponse.json({ status: 500 })
    }
  }
  return NextResponse.json({ status: 403 })
}

