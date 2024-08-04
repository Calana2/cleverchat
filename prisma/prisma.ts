import { PrismaClient } from "@prisma/client"
const bcrypt = require('bcrypt')

export const prisma = new PrismaClient()
prisma.$use((params,next)=>{
 if(params.model === "users" && ['create','update'].includes(params.action) && params.args.data['password']){
  params.args.data['password'] = bcrypt.hashSync(params.args.data['password'],10)
 }
 return next(params)
})
