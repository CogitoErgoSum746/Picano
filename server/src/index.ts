import express from "express";
import { config } from "dotenv";
config();

import api from "./routes/vision-api";
import db1 from "./routes/fetch_haukka";

// Instantiate express application.
const app = express();
const PORT: number = parseInt(process.env.PORT || '8000', 10); // Parse the port as a number.
const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WARN: Cors fix, remove in production.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Mount API routes.
app.use("/api", api);
app.use("/api", db1);

app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Started at http://${IP_ADDRESS}:${PORT}`);
});
