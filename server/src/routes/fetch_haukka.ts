import { executeQuery } from '../db_connections/haukka_db';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

// Route for getting group names.
router.get('/groups', async (req: Request, res: Response, next: NextFunction) => {
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

// Route for getting chain category names
router.get('/chain-categories', async (req, res) => {
    try {
        const query = "SELECT chain_cat_name FROM admin_chain_category WHERE status = 'active'";
        const result = await executeQuery(query);

        const values = result.map((row: any) => row.chain_cat_name);

        res.status(200).json(values);
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for getting chain names
router.get('/chains', async (req, res) => {
    try {
        const query = "SELECT chain_name FROM admin_chain WHERE status = 'active'";
        const result = await executeQuery(query);

        const values = result.map((row: any) => row.chain_name);

        res.status(200).json(values);
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for getting store names
router.get('/stores', async (req, res) => {
    try {
        const query = "SELECT store_name_fi FROM admin_store WHERE status = 'active'";
        const result = await executeQuery(query);

        const values = result.map((row: any) => row.store_name_fi);

        res.status(200).json(values);
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for getting product category names
router.get('/product-category', async (req, res, next) => {
    try {
        const query = "SELECT product_cat_name FROM product_category WHERE status = 'active'";
        const result = await executeQuery(query);

        const values = result.map((row: any) => row.product_cat_name);

        res.status(200).json(values);
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;