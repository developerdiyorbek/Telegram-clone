const io = require("socket.io")(9000, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let users = [];

const addOnlineUser = (user, socketId) => {
  const checkUser = users.find((u) => u.user._id === user._id);
  if (!checkUser) {
    users.push({ user, socketId });
  }
};

const removeOnlineUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const getSocketId = (userId) => {
  const user = users.find((u) => u.user._id === userId);
  return user ? user.socketId : null;
};

io.on("connection", (socket) => {
  // add online user
  socket.on("addOnlineUser", (user) => {
    addOnlineUser(user, socket.id);
    io.emit("getOnlineUsers", users);
  });

  // create contact
  socket.on("createContact", ({ currentUser, receiver }) => {
    const receiverSocketId = getSocketId(receiver._id);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("getCreatedUser", currentUser);
    }
  });

  // messages
  socket.on("sendMessage", ({ newMessage, receiver, sender }) => {
    const receiverSocketId = getSocketId(receiver?._id);

    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("getNewMessage", {
        newMessage,
        receiver,
        sender,
      });
    }
  });

  socket.on("readMessages", ({ receiver, messages }) => {
    const receiverSocketId = getSocketId(receiver._id);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("getReadMessages", messages);
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    removeOnlineUser(socket.id);
    io.emit("getOnlineUsers", users);
  });
});
