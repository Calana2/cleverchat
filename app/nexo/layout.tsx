import NavBar from "@/components/navBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body >
        <NavBar />
        {children}
      </body>
    </html>
  )
}
