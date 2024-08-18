import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(req: NextRequest) {

  const token = process.env.API_SECRET
  const url = new URL(req.url)
  const p = url.searchParams.get('token')

  console.log('REAL TOKEN: ',token)
  console.log('PARAM: ',p)

  if (p && p === token) {
    try {
      const users = await prisma.users.findMany({})
      return NextResponse.json(users,{ status: 200 })
    } catch (err) {
      console.log(err)
      return NextResponse.json(null,{ status: 500 })
    }
  }
  return NextResponse.json(null,{ status: 403 })
}
