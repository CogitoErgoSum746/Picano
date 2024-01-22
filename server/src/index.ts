import express from "express";
import { config } from "dotenv";
config();

import api from "./routes/vision-api";
import db1 from "./routes/fetch_haukka";

// Instantiate express application.
const app = express();
const PORT = process.env.PORT || '8000';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WARN: Cors fix, remove in production.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Mount API routes.
app.use(api);
app.use(db1);

app.listen(PORT, () => {
    console.log(`Server ready on port: ${PORT}`);
});
