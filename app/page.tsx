import UserProfile from "@/components/userProfile"

export default function Home() {
  return (
   <main className="h-svh flex items-center justify-center">
    <div className="bg-blue-800 w-1/2 h-1/2"></div> 
    <UserProfile/>
   </main>
  );
}

