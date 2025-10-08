import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

// Route to save a User
router.post('/', async (request, response) => {
    try {
        if (!request.body.name ||
            !request.body.email ||
            !request.body.password) {
            return response.status(400).send({
                message: 'Send all required fields: name, email and password'
            });
        }

        const newUser = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
        };

        const user = await User.create(newUser);

        return response.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Get admin user
router.get('/', async (request, response) => {
    try {
        const user = await User.findById("677b314df4a42d7fa23648b6");

        return response.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
