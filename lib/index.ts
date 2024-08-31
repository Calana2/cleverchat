import {SignJWT} from "jose"

export function FDToObject(form : FormData): any {
 var obj: any
 obj = {}
 form.forEach((val,key)=>(obj[key]=val.toString().trim()))
 return obj  
}

export function ObjectToFD(obj: any): FormData {
 const formData = new FormData()
 for(const key in obj){
  if(obj.hasOwnProperty(key)){
   formData.append(key,obj[key])
  }
 }
 return formData
}

export function generateXDigitCode(num: number): string {
 var s: string = ""
 for(let i=0; i < num; i++){
  let c = Math.floor(Math.random() * 10).toString()
  s+=c
 }
 return s
}

export function createJWT(payload: any): any {  
 const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET)
 return new SignJWT(payload)
 .setProtectedHeader({alg: 'HS256'})
 .setIssuedAt()
 .setExpirationTime('7d')
 .sign(encodedKey)
}


export function getCookie(cname: string) {
 let name = cname + "="
 let decodedCookie = decodeURIComponent(document.cookie)
 let ca = decodedCookie.split(";")
 for(let i=0; i<ca.length; i++){
  let c = ca[i]
  while (c.charAt(0) == ' '){
   c = c.substring(1)
  } 
  if (c.indexOf(name) == 0){
   return c.substring(name.length, c.length)
  }
 }
}

// Just for fun
export function generateNisse(): string {
 const names: string[] = ["Tontu","Freya","Liv","Gunnar","Egil"]
 const index: number = Math.floor(Math.random() * names.length)
 return names[index]
}


// Id color
export function generateColor(): string {
 const colors: string[] = ["red","blue","green","purple","yellow","orange","gray"]
 const index: number = Math.floor(Math.random() * colors.length)
 return colors[index]
}

