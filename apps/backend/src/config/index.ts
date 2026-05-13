import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error('Database url not found')
}

if (!process.env.JWT_SECRET) {
    throw new Error('jwt secret key not found')
}


export const config = {
    port: Number(process.env.PORT) || 4000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
}