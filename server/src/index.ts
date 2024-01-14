import db1 from "./routes/fetch_haukka"
import api from "./routes/vision-api"
import express, { Request, Response, NextFunction } from "express";

// Instantiate express application.
const app = express();
const PORT = 8000;

// Configure data from .env
import { config } from "dotenv";
config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/db1", db1);

// WARN: Cors fix, remove in production.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Mount API routes.
app.use("/api", api);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('indexxx');
});


app.listen(PORT, () => {
    console.log(`Started at http://localhost:${PORT}`);
});