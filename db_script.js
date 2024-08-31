import { PrismaClient } from "@prisma/client";

export async function Populate() {
  const prisma = new PrismaClient()
  console.log("> Connecting to Prisma...")
  const exists = await prisma.rooms.count({
    where: {
      name: {
        in: ROOMS.map((room) => room.name)
      }
    }
  })

  if (!exists) {
    await prisma.rooms.createMany({
      data: ROOMS
    })
    console.log("> Rooms inserted successfully")
  } else {
    console.log(">> Rooms already created")
  }
  await prisma.$disconnect()
}


const ROOMS = [
  { name: "global", description: "/global: Sé libre de expresarte" },
  { name: "advice", description: "/advice: Una crítica siempre viene bien" },
  { name: "humor", description: "/humor: No tomes nada en serio aquí" },
]
