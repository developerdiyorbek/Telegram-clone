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
  socket.on("addOnlineUser", (user) => {
    addOnlineUser(user, socket.id);
    io.emit("getOnlineUsers", users);
  });

  socket.on("createContact", ({ currentUser, receiver }) => {
    const receiverSocketId = getSocketId(receiver._id);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("getCreatedUser", currentUser);
    }
  });

  socket.on("disconnect", () => {
    removeOnlineUser(socket.id);
    io.emit("getOnlineUsers", users);
  });
});
