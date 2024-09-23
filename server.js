import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { cleanupExpiredTokens } from "./cronjob.js";
import { Populate } from "./db_script.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {


// Populate rooms
  Populate() 


// Set cronjob every 5 hours
  setInterval(()=>{
   cleanupExpiredTokens()
  },18000 * 1000)

// Set server
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  const rooms = {}            // []{id: string, username: string, ip: string}[]

  // Socket management

  io.on("connection", async (socket) => {
    // Connection
    // ----------
    console.log(socket.handshake.address + " connected")
    const sockets = await io.sockets.fetchSockets();
    setTimeout(()=>{
     io.emit("updateUserList",sockets.length) 
    },500)
    // just in case
    setTimeout(()=>{
     io.emit("updateUserList",sockets.length) 
    },3000)
     
  

    // Join request
    // ------------
    socket.on("join_room", (data) => {
      console.log(socket.handshake.address + " has joined to " + data.room)
      socket.join(data.room)
      // if the room doesn't exists then create one
      if (!rooms[data.room]) {
        rooms[data.room] = []
      }
      // for some reason in some cases the socket emmits twice in development
      // ----- 
      const length = rooms[data.room].length
      if (length > 0
        && rooms[data.room][length - 1].ip === socket.handshake.address) {
        rooms[data.room].splice(length - 1, 1) // delete the copy
      }
      // -----
      rooms[data.room].push({
        username: data.username, id: socket.id,
        ip: socket.handshake.address
      })
      io.to(data.room).emit(`update${data.room}UserList`, rooms[data.room])
    })


    // Message
    // -------

     	 socket.on("message", async (data) => {
      // Broadcast 
        console.log(data)
     	  io.to(data.room).emit("message", data)
      	 console.log(socket.handshake.address + " has emited to " + data.room)
   	 })


    // Disconnection
    // -------------
    socket.on("disconnect", async() => {
      console.log(socket.handshake.address + " disconnected")
      // Remove from the room
      const url = socket.handshake.headers.referer
      if(url.indexOf('/rooms/') != -1) {
      const room = url.slice(
        url.lastIndexOf('/') + 1,
        url.length)
      console.log(room)
      rooms[room].forEach((user, idx) => {
        if (user.ip === socket.handshake.address) {
          rooms[room].splice(idx, 1)
          return
        }
      })
       io.to(room).emit(`update${room}UserList`, rooms[room])
      }

    const sockets = await io.sockets.fetchSockets();
    io.emit("updateUserList",sockets.length)
    })
  });


  // Listening and error handling
  // ----------------------------

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});



