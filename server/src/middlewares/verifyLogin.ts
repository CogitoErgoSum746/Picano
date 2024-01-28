import { config } from "dotenv";
config();

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { executeQuery } from "../db_connections/haukka_db";


export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('authtoken');

  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied, no token provided' });
    return;
  }

  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    //   const user = decoded.data;
    if (!data) {
      res.status(401).json({ success: false, message: 'Access denied, no payload provided' });
      return;
    }

    if (data.exp < Date.now() / 1000) {
      res.status(401).json({ error: 'Token has expired' });
      return;
    }

    const username = data.user.username

    const query = `SELECT username, password FROM admin_operators_auth WHERE username = ?`

    const user = await executeQuery(query, [username]);

    if (user) {
      // req.user = data.user;
      next();
    } else {
      res.status(403).json({ success: false, message: 'Access denied' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};  