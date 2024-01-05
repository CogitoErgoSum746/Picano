import express, { Router, Request, Response, NextFunction } from 'express';
import { executeQuery } from '../db_connections/haukka_db';

const router: Router = express.Router();
router.get('/this', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = "SELECT group_name FROM admin_group WHERE status = 'active'";
        const result = await executeQuery(query);

        const values = result.map((row: any) => row.group_name);

        res.status(200).json(values);
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;