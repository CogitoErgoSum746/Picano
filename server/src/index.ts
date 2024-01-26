import express from "express";
import { config } from "dotenv";
config();

import api from "./routes/utilAPIs";
import db1 from "./routes/fetch_haukka";  
import auth from "./routes/auth";
import final_csv from "./routes/final_csv";
import { handle404, handle500 } from "./controllers/errorController";

import { verifyUser } from "./middlewares/verifyLogin";

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
app.use("/auth", auth);
app.use( verifyUser,api);
app.use( verifyUser,db1);
app.use( verifyUser,final_csv);


app.use(handle404); 
app.use(handle500);

app.listen(PORT, () => {
    console.log(`Server ready on port: ${PORT}`);
});
