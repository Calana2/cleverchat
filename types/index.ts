export type User = {
 name: string
 password: string
 repeatedPassword: string
 email: string
}

export type VerType = {
 email: string
 code: string
}

export type Token = {
 name: string
 role: string
 yourNisseIs: string
}

export type DB_Message = {
 id: number
 createdAt: Date
 body: string
 creatorId: number,
 roomId: number,
}

export type DB_User = {
 id: number,
 createdAt: Date,
 role: string,
 name: string,
 password: string,
 email: string,
 verificationCode: string, // deprecated
 verified: boolean,
}

