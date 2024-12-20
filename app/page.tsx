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
      <Link href="/nexus" className="absolute right-4 top-4">
        <HomeIcon width={30} className="text-white" />
      </Link>
      <div className="w-full h-full flex p-4 flex-col text-white bg-blue-500
      gap-5 justify-center items-center font-bold rounded-sm border
      border-neutral-600">
       <Link href="/rooms/global"> Chat Libre </Link>
       <Link href="/rooms/advice"> Consejos </Link>
       <Link href="/rooms/humor"> Humor </Link>
      </div>
    </main>
  );
}

