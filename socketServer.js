const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let inMemoryEmployees = [];
let inMemoryAttendanceRecords = [];

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("request-data", (role) => {
    if (role === "client") {
      socket.emit("update-action", { type: "employees", payload: inMemoryEmployees });
      socket.emit("update-action", { type: "attendanceRecords", payload: inMemoryAttendanceRecords });
    }
  });

  socket.on("admin-action", (data) => {
    if (data.type === "employees") {
      inMemoryEmployees = data.payload;
      // Broadcast to all clients except sender
      socket.broadcast.emit("update-action", { type: "employees", payload: inMemoryEmployees });
    } else if (data.type === "attendanceRecords") {
      inMemoryAttendanceRecords = data.payload;
      // Broadcast to all clients except sender
      socket.broadcast.emit("update-action", { type: "attendanceRecords", payload: inMemoryAttendanceRecords });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
