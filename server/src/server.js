import {config} from "dotenv";
import express from "express";
import { connectDB,disconnectDB } from "./config/database.js";


const app = express();

config();

const PORT = 3000

const server = app.listen(PORT ,() =>{
    console.log(`server running at PORT ${PORT}`);
})



process.on("unhandledRejection", (err) => {
    console.error("unhundled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    })
})


//unaughtException
process.on("uncaughtException", async (err) => {
    console.log("uncaughtException", err);
    await disconnectDB();
    process.exit(1);
})


//gracefull shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
})