import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";


const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool); // Use the correct named export


const prisma = new PrismaClient({
    adapter,

    log:
    process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"]
});

const connectDB =  async () => {
    try {
        await prisma.$connect();
        console.log("database connection succesfull");
    } catch (error) {
       console.log("database connection not succesfull");
       process.exit(1);
    }

}

const disconnectDB = async () => {
    await prisma.$disconnect();

}

export {prisma, connectDB, disconnectDB};