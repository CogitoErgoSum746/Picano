import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

import api from "./routes/utilAPIs";
import db1 from "./routes/fetch_haukka";  
import auth from "./routes/auth";
import save_csv from "./routes/save_csv";
import { handle404, handle500 } from "./controllers/errorController";

import { verifyUser } from "./middlewares/verifyLogin";

// Instantiate express application.
const app = express();
const PORT = process.env.PORT || '8000';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WARN: Cors fix, remove in production.
app.use(
    cors({
    origin: ['http://161.97.78.88', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true,
    optionsSuccessStatus: 204,
}));

// Mount API routes.
app.use("/auth", auth);
app.use(verifyUser, api);
app.use(verifyUser, db1);
app.use(verifyUser, save_csv);


app.use(handle404); 
app.use(handle500);

app.listen(PORT, () => {
    console.log(`Server ready on port: ${PORT}`);
});