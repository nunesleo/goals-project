import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGO_URI;

export const PORT = 5555;

export const mongoDBURL = mongoURI