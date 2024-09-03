import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/types"
import { FDToObject, generateXDigitCode } from "@/lib"
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {

  // security
  const token = cookies().get('CLEVER_CHAT_TOKEN')
  if (token) {
    return Response.json({ status: 500, statusText: "Usted ya cuenta con una sesión activa" })
  }

  try {
    var data: FormData
    data = await req.formData()
    var user: User
    user = FDToObject(data) as User

    // Zod validation

    const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+]).{8,}$/)

    const userSchema = z.object({
      name: z.string().min(1, { message: "El campo de nombre no puede estar vacío" }),
      password: z.string().min(1, { message: "El campo de contraseña no puede estar vacío" })
        .regex(passwordRegex, { message: "La contraseña debe contener mínimo 8 caracteres, minúsculas, por lo menos 1 mayúscula y por lo menos un caracter especial" }),
      repeatedPassword: z.string().min(1, { message: "El campo de contraseña no puede estar vacío" })
        .regex(passwordRegex, { message: "La contraseña debe contener mínimo 8 caracteres, minúsculas, por lo menos 1 mayúscula y por lo menos un caracter especial" }),
      email: z.string().min(1, { message: "El campo de correo no puede estar vacío" })
        .email({ message: "Debe ser un correo válido" }),
    })

    userSchema.parse(user)

    // Password match
    if (user.password != user.repeatedPassword) {
      throw new Error("Las contraseñas no coinciden")
    }


    await prisma.users.findFirst({
      where: {
        name: user.email
      }
    })



    const code: string = generateXDigitCode(6)

      /*** Save to the database ***/
      await prisma.users.create({
        data: {
          role: "user",
          name: user.name,
          password: user.password,  // hashed by prisma middleware
          email: user.email,
          verificationCode: code,
          verified: false,
        }
      });

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
      to: user.email,
      subject: `Codigo de verificacion para ${domain}`,
      text: `Tu codigo de verificacion es ${code}`
    })
    return NextResponse.json({ status: 200, email: `${user.email}` })

  } catch (err: any) {
    console.log(err)

    if (err instanceof z.ZodError) {
      const zodError = err as z.ZodError
      const issues = zodError.issues
      return Response.json({ statusText: issues[0].message }, {status:500})

    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch(err.code) {
       case 'P1001': 
        return Response.json({ statusText: "Error al intentar acceder a la base de datos, pruebe de nuevo" }, {status:500})
       case 'P1002': 
        return Response.json({ statusText: "Tiempo excedido accediendo a la base de datos, pruebe de nuevo" }, {status:500})
       case 'P2002': 
        return Response.json({ statusText: `Ya existe una cuenta con ese correo, si es usted y no pudo verificarlo, acceda a  https://${req.headers.get('host')}/login/password-recovery y reestablezca su cuenta introduciendo una nueva contraseña con su correo electrónico` }, {status:500})
       default:
        return Response.json({ statusText: "Error relacionado con la base de datos" }, {status:500})
      }

    } else if (err instanceof Error) {
      console.log(err.message)
      return Response.json({ statusText: err.message }, {status:500})

    } else {
      console.log(err)
      return Response.json({ statusText: "Error interno del servidor" }, {status:500})
    }
  } // catch
}
