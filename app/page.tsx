"use client"
import UserProfile from "@/components/userProfile";
import { HomeIcon } from "@heroicons/react/24/solid"
import Link from "next/link";
import { socket } from "@/socket"
if (!socket.connected) {
  socket.connect()
}


export default function Home() {

  return (
    <main className="h-svh flex items-center justify-center">
      <UserProfile />
      <Link href="/dashboard" className="absolute right-4 top-4">
        <HomeIcon width={30} />
      </Link>
      <div className="border w-1/2 h-1/2 flex p-4 flex-col">
       <Link href="/rooms/global"> Chat Libre </Link>
       <Link href="/rooms/advice"> Consejos </Link>
       <Link href="/rooms/humor"> Humor </Link>
      </div>
    </main>
  );
}

