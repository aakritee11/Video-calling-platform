import express from "express"
import {createServer} from "node:http"
import dotenv from "dotenv"
import { connectTosocket } from "./controllers/socketManager.js"

dotenv.config();

import {Server} from "socket.io"

import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./routes/usersRoutes.js";

const app = express();
const server = createServer(app);
const io = connectTosocket(server);

app.set("port",(8000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended: true}));

app.use("/api/v1/users", userRoutes);

app.get("/home",(req,res)=>{
    return res.json({"hello":"world"});
})

const start = async()=>{
    app.set("mongo_user")
    const connectionDb = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`MONGO connect db host:${connectionDb.connection.host}`);
// console.log(process.env.CONNECTION_STRING);
    server.listen(app.get("port"),()=>{
        console.log("listening on port 8000");
    })
}

start();