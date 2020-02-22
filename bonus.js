//Users currently online
const onlineUsers = {};

io.on("connection", socket => {
    onlineUsers[socket.id] = userId;
    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
    });
});

//Wall Posts
