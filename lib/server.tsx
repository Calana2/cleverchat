"use server"
import {jwtVerify} from "jose"
import {cookies} from "next/headers"

const OK = 1

export async function decryptJWT(session: any) {
        try {
         const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET)
         const payload = await jwtVerify(session, encodedKey, {
           algorithms:['HS256'],
         })
         return payload
        } catch (err) {
         console.log(err)
          return {payload:{name:"unknown",role:"unknown",yourNisseIs:"unknown"}}
        }
}

export async function deleteCookie(cname: string){
 cookies().delete(cname)
}


