"use client"
import {useState, useEffect} from "react"
import NavItem from "./navItem";
import LoadingScreen from "./loadingScreen";

type LinkItem = {
  text: string
  url: string
}

const ITEMS: LinkItem[] = [
  { text: "Inicio", url: "/" },
  { text: "Iniciar Sesión", url: "/login" },
  { text: "Registrarse", url: "/register" },
]

export default function NavBar() {
const [screenWidth, setScreenWidth] = useState(0);
const [load, setLoad] = useState<boolean>(false)
const medium="flex-col border-2 px-5 py-10 left-20 top-1/3"
const small="bottom-0 items-center justify-center w-full py-5 border-t-2"

function handleClick(_: any){
 setLoad(true)
 setLoad(false)
}

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Inicializa el ancho al cargar la página

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); 




  return (
    <nav className={`border-gray-300 rounded-md gap-2 shadow-lg absolute flex flex-col ${screenWidth < 768 ? small : medium}`}>
      {screenWidth == 0 ? null : ITEMS.map((item, index) => (<div key={index} onClick={handleClick}><NavItem text={item.text} url={item.url} /></div>))}
      { load ? <div className="mt-2"><LoadingScreen/></div> : null }
    </nav>
  )
}
