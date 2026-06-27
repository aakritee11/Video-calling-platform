import dotenv from "dotenv"
dotenv.config();
import express from "express"
import {createServer} from "node:http"
import { connectTosocket } from "./src/controllers/socketManager.js"



import {Server} from "socket.io"

import mongoose from "mongoose"
import cors from "cors"
import usersRoutes from "./src/routes/usersRoutes.js";


const app = express();
const server = createServer(app);
const io = connectTosocket(server);
console.log("socket server initialized");

const PORT = process.env.PORT|| 8000;
app.set("port",PORT);
app.use(cors(
    {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}
));
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended: true}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use("/api/v1/users", usersRoutes);

app.get("/",(req,res)=>{
    return res.json({
        message: "Video Calling API",
        version: "1.0.0",
        status: "running"
    });
})

const start = async()=>{
    
    const connectionDb = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`MONGO connect db host:${connectionDb.connection.host}`);
    server.listen(PORT,()=>{
        console.log(`listening on ${PORT}`);
    })
}

start();