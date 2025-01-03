import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import goalRoutes from "./routes/goalRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";
import cors from 'cors';

const app = express();

app.use(cors());
// app.use(cors({
//     origin : 'https:localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders : ['Content-Type'],
// }));

app.use(express.json());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("HELLO");
});

app.use('/goals', goalRoutes);
app.use('/contributions', contributionRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });