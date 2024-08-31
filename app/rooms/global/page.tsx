// I am go to use this has a template, just copy and paste
// changing ROOM_TAG and ROOM_FIRST_MESSAGE should work for make new rooms
"use client";

import { useEffect, useRef, useState } from "react";
import { JWTPayload, JWTVerifyResult } from "jose";
import { Bars3Icon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { socket } from "@/socket"
import { ObjectToFD, getCookie, generateColor } from "@/lib";
import { decryptJWT } from "@/lib/server";
import { DB_Message, DB_User } from "@/types";
import Announcement from "@/components/announcement";
import Message from "@/components/message";

const ROOM_TAG = "global"
const ROOM_FIRST_MESSAGE = 
`Bienvenido a la sección "Chat Libre", donde se puede exporar cualquier tema, desde noticias internacionales hasta las razones de por qué tu vida apesta. Compartimos informacion relevante y perspectivas diversas.`

type UserInfo = {
  username: string
  id: string
}

type Message = {
  message: string
  ownedByMe: boolean
  alias: string
  createdAt: number | string
  databaseId: number
}

/* Message object send to the database at CREATE looks like this:
type MessageToDB = {
  message: string
  alias: string
  createdAt: number
  databaseId: number
  email: string
  room: string
  id: string
}
*/


export default function Page() {
  // Definitions
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");

  // Data from the users in the room
  const [roomList, setRoomList] = useState<UserInfo[] | undefined>(undefined);

  // Setting up interaction
  const [messageList, setMessageList] = useState<Message[]>([])
  const [showRoomList, setShowRoomList] = useState<boolean>(false)
  const [idColor, setIdColor] = useState<string>("white")
  const textboxRef: any = useRef(null)
  const chatRef: any = useRef(null)

  // Pop ups
  const [connAlert, setConnAlert] = useState<boolean>(false)
  const [optionsMenu, setOptionsMenu] = useState<boolean>(false)
  const [blurChat, setBlurChat] = useState<boolean>(false)

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
  const SendMessage = async () => {
    getInfo().then((jwt) => {
      if (textboxRef.current?.value === "") {
        return
      }
      // Save first
      fetch('../../api/messages/create', {
        method: "POST", body: ObjectToFD(
          { ...jwt, room: ROOM_TAG, message: textboxRef.current?.value })
      })
        .then((fetch_response) => {
          fetch_response.json()
            .then((json_response) => {
              // Send message
              socket.emit("message", {
                room: ROOM_TAG,
                message: textboxRef.current?.value,
                id: socket.id,
                alias: jwt?.name,
                email: jwt?.email,
                createdAt: Date.now(),
                databaseId: json_response?.databaseId,
              })
              textboxRef.current.value = ""
            })
        })

    }).catch((err) => {
      console.log(err)
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
    localStorage.setItem("lastId", messageList[messageList.length - 1].databaseId.toString())
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

    localStorage.setItem("lastId", "0")
    setIdColor(generateColor())

    if (socket.connected) {
      onConnect();
    }

    async function onConnect() {
      const jwtPublic = await getInfo()
      setIsConnected(true);                            // check connection
      setTransport(socket.io.engine.transport.name);   // check type of transport

      // join room
      socket.emit("join_room", {
        room: ROOM_TAG,
        username: jwtPublic?.name,
        id: socket.id,
      })

      // message retrieve
      const res: Response = await fetch(`../../api/messages/read?room=${ROOM_TAG}&lastId=${parseInt(localStorage.getItem("lastId") as string)}`)
      const data: DB_Message[] = await res.json()
      for (const m of data) {
        // get email 
        const res: Response = await fetch(`../../api/messages/read?id=${m.creatorId}`)
        const user: DB_User = await res.json()
        // new type
        const formatedMessage = {
          ownedByMe: user.email == jwtPublic?.email,
          alias: user.name, message: m.body,
          databaseId: m.id, createdAt: m.createdAt.toString()
        }
        // ending
        setMessageList(prev => [...prev, formatedMessage])
        setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight }, 50)
      }
      if (data.length) {
        localStorage.setItem("lastId", data[data.length - 1].toString())
      }

      // more stuff
      socket.io.engine.on("upgrade", (transport: Object | any) => {
        setTransport(transport.name);
      });
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
      const newMessage: Message = {
        ownedByMe: data.id == socket.id, message: data.message,
        alias: data.alias, databaseId: data.databaseId,
        createdAt: data.createdAt
      }
      setMessageList(prevMessages => [...prevMessages, newMessage])
      localStorage.setItem("last_id_recovery", newMessage.databaseId.toString())

      // Scroll to the last
      if (data.id == socket.id && chatRef.current != null) {
        setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight }, 50)
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

        <Message text={ROOM_FIRST_MESSAGE} ownedByMe={false}
          alias={"Mensaje de ["+ROOM_TAG+"]"} createdAt={0} />

        {
          messageList ? messageList.map((val, idx) =>
          (<Message text={val.message} ownedByMe={val.ownedByMe}
            alias={val.alias} createdAt={val.createdAt} key={idx} />))
            : ""
        }
      </div>


      {/* Menu */}
      <div className="bg-blue-500 flex items-center justify-evenly gap-1 
      flex-col md:flex-row p-2">
        {/* Options Button */}
          <button className="bg-blue-800 p-2 px-4 rounded-md text-sm md:text-base"
            onClick={handleMenu}>
            <Bars3Icon width={"2.5em"} height={"2.5em"} style={{ color: "white" }} />
          </button>


        {/* TextBox */}
        <textarea style={{ borderRadius: "0.375rem", padding: "0.3rem" }}
          className="grow-6 h-full w-full md:w-full md:h-2/3 text-sm md:text-base"
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
              className="bottom-1/2 left-1/2 translate-x-[-50%] translate-y-[25%]
              bg-blue-600 rounded-md shadow-lg text-white px-20 md:px-10 py-5"
              child={(
                <ul className="flex flex-col gap-4 list-disc">
                  <li className="hover:bg-blue-800 rounded-md p-4 w-full text-start"
                    onClick={() => { setShowRoomList(true) }}>
                    Ver usuarios en linea
                  </li>
                  <li className="hover:bg-blue-800 rounded-md p-4 w-full text-start">
                    <Link href="/">Volver al Menú</Link>
                  </li>
                </ul>
              )}
            />)
            : ""}
          {showRoomList
            ? (<div className="fixed z-50 inset-0
               bg-gradient-to-r from-blue-400 to-blue-800 overflow-scroll">

              <div onClick={() => setShowRoomList(false)}
                className="fixed top-2 right-10 bg-blue-600 border-2 border-black
                  text-white hover:cursor-pointer">
                <XMarkIcon width={32} height={32} />
              </div>

              <div className="flex flex-col border-3 border-black">
                <table className="bg-white">
                  <tr className="font-thin border-2 border-black">
                    <th><p>Usuario</p></th>
                    <th><p>Id</p></th>
                  </tr>

                  {roomList !== undefined
                    ? roomList.map((val, idx) => (
                      <tr key={idx} className="font-thin border-2 border-black">
                        <th className="flex justify-center"><p className=
                          {`bg-${idColor}-500 px-1`}>{val.username}</p></th>
                        <th className="text-center"><p>{val.id}</p></th>
                      </tr>))
                    : ""
                  }
                </table>
              </div>
            </div>)
            : ""
          }
        </div>
      </div>
    </main>
  );
}
