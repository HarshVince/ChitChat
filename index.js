require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const os = require('os');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const { connectMongoDB } = require('./connection.js');
const { restrictToLoggedinUsers, checkAuth } = require('./middlewares/auth.js');
const { registerRoomSockets } = require('./sockets/room.js');

const staticRoute = require('./routes/staticRouter.js');
const userRouter = require('./routes/user.js');
const roomRouter = require('./routes/room.js');

const app = express();
const server = http.createServer(app);        
const io = new Server(server, { maxHttpBufferSize: 5e6 });
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

connectMongoDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/study-room')
    .then(() => console.log("connected MongoDB"))
    .catch(err => console.log("MongoDB error:", err.message));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use("/user", userRouter);
app.use("/room", restrictToLoggedinUsers, roomRouter);
app.use("/", checkAuth, staticRoute);

registerRoomSockets(io);

server.listen(port, '0.0.0.0', () => {
    console.log(`server started at port: ${port}`);
    console.log(`you:    http://localhost:${port}`);
    Object.values(os.networkInterfaces()).flat().forEach(i => {
        if (i.family === 'IPv4' && !i.internal) console.log(`friend: http://${i.address}:${port}`);
    });
});
