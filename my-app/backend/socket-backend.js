const {Server} = require('socket.io');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            // React is run on port 3000
            origin: "http://localhost:3000",
            // Requests that socket is allowed to utilize
            methods: ["GET", "POST"],
        },
    });

    // Listening for event with name 'connection'
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Listening for event with name "join_room", with room name passed
        socket.on("join_room", (data) => {
            socket.join(data);
            console.log(`User with ID: ${socket.id} joined room: ${data}`)
        });

        // Listening for event with name "send_message", with data passed
        socket.on("send_message", (data) => {
            socket.to(data.room).emit("receive_message", data);
        });

        // Listening for event with name 'disconnect'
        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });

    app.use(cors());
}