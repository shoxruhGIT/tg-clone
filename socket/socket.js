const io = require("socket.io")(5000, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

let users = [];

const addOnlineUser = (user, socketId) => {
  const checkUser = users.find((u) => u.user._id === user._id);
  if (!checkUser) {
    users.push({ user, socketId });
  }
};

const getSocketId = (userId) => {
  const user = users.find((u) => u.user._id === userId);
  return user ? user.socketId : null;
};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("addOnlineUser", (user) => {
    addOnlineUser(user, socket.id);
    io.emit("getOnlineUsers", users);
  });

  socket.on("createContact", ({ currentUser, receiver }) => {
    const receiverSocketId = getSocketId(receiver._id);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("getCreatedUse", currentUser);
    }
  });

  socket.on("sendMessage", ({ newMessage, receiver, sender }) => {
    const receiverSocketId = getSocketId(receiver._id);

    if (receiverSocketId) {
      socket
        .to(receiverSocketId)
        .emit("getNewMessage", { newMessage, receiver, sender });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("getOnlineUsers", users);
  });
});
