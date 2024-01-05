import { config } from "dotenv";
config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import db1 from "./routes/fetch_haukka"

const PORT = 8000;

const app = express();

// app.use(
//     cors({
//         origin: ['https://successteps.in', 'http://localhost:3000'],
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         // credentials: true,
//         optionsSuccessStatus: 204,
//     })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/db1", db1)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('indexxx');
});


console.log(`started at http://localhost:${PORT}`);
app.listen(PORT);