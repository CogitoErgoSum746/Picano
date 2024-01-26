import { config } from "dotenv";
config();

import { NextFunction, Request, Response } from 'express';
import { signToken } from '../utils/token';
import { validationResult } from 'express-validator';
import { executeQuery } from "../db_connections/haukka_db";

export async function login(req: Request, res: Response, next: NextFunction): Promise<any> {

    let success = false;

    // If there are validation errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success, errors: errors.array() });
        return;
    }
    try {
        const { username, password } = req.body;

        const query = `SELECT username, password FROM admin_operators_auth WHERE username = ? AND password = ?`

        const user = await executeQuery(query, [username, password]);

        if (!user) {
            res.status(403).json({ success: false, message: 'Access denied' });
            return;
        }

        // Token authentication using JWT
        const authtoken = signToken(user[0].username, user[0].password);

        res.status(200).json({ success: true, authtoken });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
    }
};