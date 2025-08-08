const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitingUser = null;

app.use(express.static('public'));

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    if (waitingUser) {
        // Pair the users
        const room = `${socket.id}#${waitingUser.id}`;
        socket.join(room);
        waitingUser.join(room);

        socket.emit('chat-start', { room });
        waitingUser.emit('chat-start', { room });

        waitingUser = null;
    } else {
        waitingUser = socket;
    }

    socket.on('message', ({ room, message }) => {
        socket.to(room).emit('message', { message });
    });

    socket.on('next', () => {
        socket.disconnect();
    });

    socket.on('disconnect', () => {
        if (waitingUser === socket) waitingUser = null;
        console.log(`User disconnected: ${socket.id}`);
        console.log('----------------------');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

