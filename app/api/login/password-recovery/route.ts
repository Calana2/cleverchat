import { FDToObject } from "@/lib";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod";

type recovery_put = { email: string, password: string, repeatedPassword: string }

type recovery_post = { email: string }

export async function POST(req: NextRequest) {
  try {
    var data: FormData
    data = await req.formData()
    var r: recovery_post
    r = FDToObject(data) as recovery_post


    /*** Database update ***/
    const token = uuidv4()
    await prisma.recuperation.create({
      data: {
        email: r.email, // Este debe ser el email del usuario existente
        token: token,
      },
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
      subject: `Enlace de recuperación para ${domain}`,
      // Change if http or https
      text: `Tu enlace de recuperación es http://${domain}/login/password-reset/${token}`
    })

    return NextResponse.json({ status: 200 })

  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ status: 500, statusText: err.message })
    } else {
      return NextResponse.json({ status: 500, statusText: "Error interno del servidor" })
    }
  }
}

export async function PUT(req: NextRequest) {
  try {
    var data: FormData
    data = await req.formData()
    var input: recovery_put
    input = FDToObject(data) as recovery_put

    if (input.password != input.repeatedPassword) {
      throw new Error("Las contraseñas no coinciden")
    }

    // Zod validation
    const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+]).{8,}$/)

    const userSchema = z.object({
      password: z.string().min(1, { message: "El campo de contraseña no puede estar vacío" })
        .regex(passwordRegex, { message: "La contraseña debe contener mínimo 8 caracteres, minúsculas, por lo menos 1 mayúscula y por lo menos un caracter especial" }),
      repeatedPassword: z.string().min(1, { message: "El campo de contraseña no puede estar vacío" })
        .regex(passwordRegex, { message: "La contraseña debe contener mínimo 8 caracteres, minúsculas, por lo menos 1 mayúscula y por lo menos un caracter especial" }),
      email: z.string().email(),
    })

    userSchema.parse(input)


    // Update the database
    await prisma.users.update({
      where: {
        email: input.email
      },
      data: {
        password: input.password,   // hashed for prisma middleware
        verificationCode: "ACCEPTED",
        verified: true,
      }
    })

    await prisma.recuperation.deleteMany({
      where: {
        email: input.email
      }
    })

    return NextResponse.json({ status: 200 })

  } catch (err) {
    if (err instanceof z.ZodError) {
      const zodError = err as z.ZodError
      const issues = zodError.issues
      return Response.json({ statusText: issues[0].message }, { status: 500 })
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P1001':
          return Response.json({ statusText: "Error al intentar acceder a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P1002':
          return Response.json({ statusText: "Tiempo excedido accediendo a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P1002':
          return Response.json({ statusText: "Tiempo excedido accediendo a la base de datos, pruebe de nuevo" }, { status: 500 })
        case 'P2002':
          return Response.json({ statusText: "Ya existe una cuenta con ese correo, si es usted y no pudo verificarlo, acceda a: " }, { status: 500 })
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




