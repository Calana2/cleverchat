## Chat App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

npm install

#### First modify the .env file:

DATABASE_URL="your_database_connection_query"                       

NODEMAILER_SERVER="your_smtp_server"

NODEMAILER_USER="your_email"

NODEMAILER_PASS="your_email_password_or_passcode"

// You can generate this one easily with: openssl rand --base64 30

JWT_SECRET="x_character_secret"


#### This project uses Prisma ORM

npx prisma generate && npx prisma push


#### Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


