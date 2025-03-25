import { Server } from 'socket.io';

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            // React is run on port 3000
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", (data) => {
            socket.join(data);
            console.log(`User with ID: ${socket.id} joined room: ${data}`)
        });

        socket.on("send_message", (data) => {
            io.to(data.roomId).emit('receive_message', data);
            console.log(data);
        });

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
}

export default initializeSocket;