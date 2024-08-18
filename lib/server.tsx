"use server"
import {JWTPayload, JWTVerifyResult, jwtVerify} from "jose"
import {cookies} from "next/headers"


export async function decryptJWT(session: any | string): Promise<JWTVerifyResult<JWTPayload> | null> {
        try {
         const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET)
         const payload = await jwtVerify(session, encodedKey, {
           algorithms:['HS256'],
         })
         return payload
        } catch (err) {
         console.log(err)
          return null
        }
}

export async function deleteCookie(cname: string){
 cookies().delete(cname)
}


