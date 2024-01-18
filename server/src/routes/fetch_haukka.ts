import { executeQuery } from '../db_connections/haukka_db';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

const handleRoute = async (req: Request, res: Response, query: string, params?: any) => {
    try {
        const result = await executeQuery(query, params);
        const values = result.map((row: any) => Object.values(row)[0]);
        res.status(200).json(values);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Route for getting group names
router.get('/group_names', async (req: Request, res: Response, next: NextFunction) => {
    const query = "SELECT group_name FROM admin_group WHERE status = 'active'";
    handleRoute(req, res, query);
});

// Route for getting chain category names
router.get('/chain_categories', async (req, res, next) => {
    const query = "SELECT chain_cat_name FROM admin_chain_category WHERE status = 'active'";
    handleRoute(req, res, query);
});

// Route for getting chain names
router.get('/chain_names', async (req, res, next) => {
    const query = "SELECT chain_name FROM admin_chain WHERE status = 'active'";
    handleRoute(req, res, query);
});

// Route for getting store names
router.get('/store_names', async (req, res, next) => {
    const query = "SELECT store_name_fi FROM admin_store WHERE status = 'active'";
    handleRoute(req, res, query);
});

// Route for getting product category names
router.get('/product_category', async (req, res, next) => {
    const query = "SELECT product_cat_name FROM product_category WHERE status = 'active'";
    handleRoute(req, res, query);
});

router.get('/group_from_chain_category/:chain_cat_name', async (req, res, next) => {
    try {
        const { chain_cat_name } = req.params;

        const query = `
  SELECT DISTINCT ag.group_name
  FROM admin_chain_category acc
  JOIN admin_chain ac ON acc.chain_cat_id = ac.chain_cat_id
  JOIN admin_group ag ON ac.group_id = ag.group_id
  WHERE acc.chain_cat_name = ? AND ac.status = 'active' AND ag.status = 'active'
`;

        const result = await executeQuery(query, [chain_cat_name]);

        if (!result.length) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }

        const group_name = result[0].group_name;

        res.status(200).json({ group_name });
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/group_from_chain_name/:chain_name', async (req, res, next) => {
    try {
        const { chain_name } = req.params;

        const query = `
            SELECT DISTINCT ag.group_name
            FROM admin_chain ac
            JOIN admin_group ag ON ac.group_id = ag.group_id
            WHERE ac.status = 'active' AND ac.chain_name = ?
        `;

        const result = await executeQuery(query, [chain_name]);

        if (!result.length) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }

        const group_name = result[0].group_name;

        res.status(200).json({ group_name });
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/group_from_store_name/:store_name', async (req, res, next) => {
    try {
        const { store_name } = req.params;

        const query = `
            SELECT DISTINCT ag.group_name
            FROM admin_store as ast
            JOIN admin_group ag ON ast.group_id = ag.group_id
            WHERE ast.status = 'active' AND ast.store_name_fi = ?
        `;

        const result = await executeQuery(query, [store_name]);

        if (!result.length) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }

        const group_name = result[0].group_name;

        res.status(200).json({ group_name });
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/chain_category_from_chain_name/:chain_name', async (req, res, next) => {
    try {
        const { chain_name } = req.params;

        const query = `
            SELECT DISTINCT acc.chain_cat_name
            FROM admin_chain ac
            JOIN admin_chain_category acc ON ac.chain_cat_id = acc.chain_cat_id
            WHERE ac.status = 'active' AND ac.chain_name = ?
        `;

        const result = await executeQuery(query, [chain_name]);

        if (!result.length) {
            res.status(404).json({ error: 'Chain category not found' });
            return;
        }

        const chain_cat_name = result[0].chain_cat_name;

        res.status(200).json({ chain_cat_name });
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/chain_category_from_store_name/:store_name', async (req, res, next) => {
    try {
        const { store_name } = req.params;

        const query = `
            SELECT DISTINCT acc.chain_cat_name
            FROM admin_store ast
            JOIN admin_chain ac ON ast.chain_id = ac.chain_id
            JOIN admin_chain_category acc ON ac.chain_cat_id = acc.chain_cat_id
            WHERE ast.status = 'active' AND ast.store_name_fi = ?
        `;

        const result = await executeQuery(query, [store_name]);

        if (!result.length) {
            res.status(404).json({ error: 'Chain category not found' });
            return;
        }

        const chain_cat_name = result[0].chain_cat_name;

        res.status(200).json({ chain_cat_name });
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/chain_name_from_store_name/:store_name', async (req, res, next) => {
    try {
        const { store_name } = req.params;

        const query = `
            SELECT DISTINCT ac.chain_name
            FROM admin_store ast
            JOIN admin_chain ac ON ast.chain_id = ac.chain_id
            WHERE ast.status = 'active' AND ast.store_name_fi = ?
        `;

        const result = await executeQuery(query, [store_name]);

        if (!result.length) {
            res.status(404).json({ error: 'Chain name not found' });
            return;
        }

        const chain_name = result[0].chain_name;

        res.status(200).json({ chain_name });
        return;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;