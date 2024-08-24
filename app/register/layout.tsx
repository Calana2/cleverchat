
import NavBar from "@/components/navBar";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <Suspense>
         {children}
        </Suspense>
      </body>
    </html>
  )
}

