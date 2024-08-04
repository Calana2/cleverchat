import { NextRequest, NextResponse } from "next/server";
import { VerType } from "@/types"
import { FDToObject } from "@/lib"
import { prisma } from "@/prisma/prisma"

export async function POST(req: NextRequest){
 try {
  var data: FormData = await req.formData() 
  var userVer: VerType =  FDToObject(data) as VerType
  if(!userVer.email) {
   throw new Error("Usuario desconocido")
  }

  const user = await prisma.users.findFirst({
          where: {
           email: userVer?.email
          }       
  })

  if(user?.verificationCode === userVer.code) {
          await prisma.users.update({
                  where: {
                   id: user.id       
                  },
                  data: {
                   verified: true,
                   verificationCode: "ACCEPTED",
                  }
          }) 
         return NextResponse.json({status:200})
  } 
  throw new Error("Codigo de verificacion incorrecto")

 } catch (err: any) {
  console.log(err)
  if(err instanceof Error){
   return NextResponse.json({status:500,statusText:err.message})
  }
  return NextResponse.json({status:500,statusText:"Error interno del servidor"})
 }
}
