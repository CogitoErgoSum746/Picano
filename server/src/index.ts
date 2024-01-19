import express from "express";

import api from "./routes/vision-api";
import db1 from "./routes/fetch_haukka";
import pdfTOimg from "./routes/pdf-to-image";

// Instantiate express application.
const app = express();
const PORT = 8000;

// Configure data from .env
import { config } from "dotenv";
config();

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
app.use("/api", pdfTOimg);

app.listen(PORT, () => {
    console.log(`Started at http://localhost:${PORT}`);
});