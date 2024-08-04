import { FDToObject, generateXDigitCode } from "@/lib";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

type verification_forwarding = { email: string }

export async function PUT(req: NextRequest) {
  try {
    var data: FormData
    data = await req.formData()
    var r: verification_forwarding
    r = FDToObject(data) as verification_forwarding

    /*** Database update ***/
    const code: string = generateXDigitCode(6)
    await prisma.users.update({
          where: {
            email: r.email 
          },
          data: {
            verificationCode: code,
            verified: false,
          }
        })

    /*** Email verification ***/
    const shortenedURL: string = req.url.replace(/^https?:\/\//, '')
    const domain: string = shortenedURL.split('/')[0]
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: r.email,
      subject: `Codigo de verificacion para ${domain}`,
      text: `Tu codigo de verificacion es ${code}`
    })
    
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ status: 500, statusText: err.message })
    } else {
      return NextResponse.json({ status: 500, statusText: "Error interno del servidor" })
    }
  }
 return NextResponse.json({status:200})
}

