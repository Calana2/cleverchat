// I am go to use this has a template, just copy and paste, changing ROOM_TAG should work for make new rooms
"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket"
import { getCookie } from "@/lib";
import { decryptJWT } from "@/lib/server";
import { JWTPayload, JWTVerifyResult } from "jose";
import Message from "@/components/message";
import { Bars3Icon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Announcement from "@/components/announcement";
import Link from "next/link";

const ROOM_TAG = "humor"

type UserInfo = {
  username: string
  id: string
  ip: string
}

type Message = {
  message: string
  ownedByMe: boolean
  alias: string
}

export default function Page() {
  // Definitions
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");

  // Data from the users in the room
  const [roomList, setRoomList] = useState<UserInfo[] | undefined>(undefined);

  // Setting up interaction
  const [messageList, setMessageList] = useState<Message[]>([])
  const textboxRef: any = useRef(null)
  const chatRef: any = useRef(null)
  const [blurChat,setBlurChat] = useState<boolean>(false)

  // Pop ups
  const [connAlert, setConnAlert] = useState<boolean>(false)
  const [optionsMenu, setOptionsMenu] = useState<boolean>(false)
  const [showRoomList, setShowRoomList] = useState<boolean>(false)

  // Get the session cookie
  const getInfo = async () => {
    const jwt = getCookie("CLEVER_CHAT_TOKEN")
    try {
      const data: JWTVerifyResult<JWTPayload> | null = await decryptJWT(jwt)
      return data?.payload
    } catch (err: any | Error) {
      console.log(err)
      return null
    }
  }

  // Send message using socket.io
  const SendMessage = () => {
    getInfo().then((data) => {
      if (textboxRef.current?.value === "") {
        console.log("VACIA`")
        return
      }

      socket.emit("message", {
        room: ROOM_TAG,
        message: textboxRef.current?.value,
        id: socket.id,
        alias: data?.name,
      })
      textboxRef.current.value = ""
    })
  }

  // Manipulate textbox behavior
  const handleTextbox = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault()
          SendMessage()
        }
        return
      default:
        return
    }
  }

  // Handle connect/disconnect socket
  const handleConnection = () => {
    socket.connected ? socket.disconnect() : socket.connect()
    setTimeout(() => { setConnAlert(true) }, 300)
    setTimeout(() => { setConnAlert(false) }, 1500)
  }

 // Handle menu display
  const handleMenu = () => {
   setOptionsMenu(!optionsMenu)
   setBlurChat(!blurChat)
  }


  // useEffect with socket manipulation
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      let jwtPublic: any
      getInfo().then((data) => {
        jwtPublic = data // do something
      })
        .then((_) => {
          setIsConnected(true);                            // check connection
          setTransport(socket.io.engine.transport.name);   // check type of transport
          socket.emit("join_room", {
            room: ROOM_TAG,
            username: jwtPublic.name,
            id: socket.id,
          })

          socket.io.engine.on("upgrade", (transport: Object | any) => {
            setTransport(transport.name);
          });
        })
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onUpdate(data: UserInfo[] | undefined) {
      setRoomList(data)
    }

    function onMessage(data: any) {
      // Get the messages
      const newMessage = { ownedByMe: data.id == socket.id, message: data.message, alias: data.alias }
      setMessageList(prevMessages => [...prevMessages, newMessage])
      // Scroll to the last
      if (data.id == socket.id && chatRef.current != null) {
        setTimeout(() => {
          chatRef.current.scrollTop = chatRef.current.scrollHeight
        }, 50)
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(`update${ROOM_TAG}UserList`, (data) => onUpdate(data))
    socket.on("message", (data) => { onMessage(data) });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`update${ROOM_TAG}`, onUpdate);
      socket.off(`message`, onMessage);
    };
  }, []);



  // Render
  return (
    <main className="w-svw h-svh flex flex-col justify-between">
      {/* Banner */}
      <div className="bg-blue-500">
      </div>

      {/* Chat */}
      <div className={`overflow-y-auto p-4 flex flex-col gap-3 ${blurChat ? "blur-sm" : ""}`}
        style={{ height: "80vh" }} ref={chatRef}>
        {
          messageList ? messageList.map((val, idx) =>
            (<Message text={val.message} ownedByMe={val.ownedByMe} alias={val.alias} key={idx} />))
            : ""
        }
      </div>


      {/* Menu */}
      <div className="bg-blue-500 flex items-center justify-evenly gap-1 
      flex-col md:flex-row p-2">

        {/* Options Button */}
         <button className="bg-blue-800 p-2 px-4 rounded-md text-sm md:text-base"
          onClick={handleMenu}>
          <Bars3Icon width={"2.5em"} height={"2.5em"} style={{color: "white" }}/>
         </button>

        {/* TextBox */}
        <textarea style={{ borderRadius: "0.375rem", padding: "0.3rem" }}
          className="grow-6 h-1/4 w-full md:h-2/3 text-sm md:text-base"
          ref={textboxRef} onKeyDown={handleTextbox} >
        </textarea>

        {/* Sending and Connection Buttons */}
        <div className="flex gap-2 p-2">
          <button className="bg-blue-800 p-2 px-4 rounded-md text-sm md:text-base"
            onClick={SendMessage}>
            <PaperAirplaneIcon width={"2.5em"} height={"2.5em"} style={{ color: "white" }} />
          </button>
          <button className="bg-blue-800 p-2 px-4 rounded-md text-white text-sm md:text-base"
            style={{ width: "8.5em", height: "3.5em" }}
            onClick={handleConnection}>
            {isConnected ? "Desconectar" : "Conectar"}
          </button>

         {/* Pop ups*/}
          {connAlert ?
            (<Announcement
              className="bottom-36 md:bottom-32 bg-blue-600 p-2 w-40 h-20 break-words
              rounded-sm text-white"
              text={isConnected ?
                `En línea`
                : `Desconectado`}
            />)
            : ""}
          {optionsMenu ?
            (<Announcement
              className="bottom-1/2 md:right-1/2 bg-blue-600 h-1/4 w-1/2 md:w-1/4
              rounded-sm text-white"
              child={(
               <ul className="flex flex-col gap-4 list-disc">
                <li className="hover:bg-blue-800 rounded-md p-4 w-full text-start"
                 onClick={()=>{setShowRoomList(true)}}>
                 Ver usuarios en linea
                </li>
                <li className="hover:bg-blue-800 rounded-md p-4 w-full text-start">
                  <Link href="/">Volver al Inicio</Link>
                </li>
               </ul>
              )}
            />)
            : ""}
          {showRoomList 
            ? (<div className="fixed inset-0 bg-white flex flex-col z-20 
               items-center justify-center overflow-y-scroll">
               
                <div onClick={()=>setShowRoomList(false)}
                  className="fixed top-2 right-10 bg-blue-600 border 
                  text-white hover:cursor-pointer">
                 <XMarkIcon width={32} height={32} />
                </div>

                <table className="w-11/12 md:w-2/3 border-2
                bg-blue-600 border-blue-950 overflow-y-scroll">
                 <tr className="font-bold border-b-2 border-blue-950">
                  <th><p>Usuario</p></th>
                  <th><p>Id</p></th>
                 </tr>
                
             { roomList !== undefined
               ? roomList.map((val,idx)=>(
                 <tr key={idx} className="font-thin">
                  <th><p>{val.username}</p></th>
                  <th className="text-green-400"><p>{val.id}</p></th>
                 </tr>))
                : ""
             }
               </table>
             </div>)
            : ""
          }
        </div>
      </div>
    </main>
  );
}
