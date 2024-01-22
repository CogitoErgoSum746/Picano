import { executeQuery, executeMultipleQueries } from '../db_connections/haukka_db';
import { ParsedQs } from 'qs';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

interface IdValuePair {
    id: string;
    value: string;
}

interface Output {
    group: IdValuePair[];
    chain_category: IdValuePair[];
    chain: IdValuePair[];
    store: IdValuePair[];
}

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

// Route for getting product category names
router.get('/product_category', async (req, res, next) => {
    const query = "SELECT product_cat_name FROM product_category WHERE status = 'active'";
    handleRoute(req, res, query);
});


router.get('/auto-dropdown', async (req, res, next) => {
    try {
        // /auto-dropdown/?group[id]=_id&group[value]=_value

        let output: Output = {
            group: [],
            chain_category: [],
            chain: [],
            store: []
        }

        let group_idValuePairs: IdValuePair[] = [

        ];
        let chaincategory_idValuePairs: IdValuePair[] = [

        ];
        let chain_idValuePairs: IdValuePair[] = [

        ];
        let store_idValuePairs: IdValuePair[] = [

        ];

        if (req.query.group && typeof req.query.group === 'object') {
            const Params = req.query.group as ParsedQs;
            const groupId = Params.id as string;
            const groupValue = Params.value as string;

            group_idValuePairs.push({ id: groupId, value: groupValue });

            const params = [groupId];

            const queries = [
                {
                    query: `SELECT ac.chain_cat_id, acc.chain_cat_name
                            FROM admin_chain ac
                            JOIN admin_chain_category acc ON ac.chain_cat_id = acc.chain_cat_id
                            WHERE ac.group_id = ? AND ac.status = 'active' AND acc.status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT chain_id, chain_name
                            FROM admin_chain
                            WHERE group_id = ? AND status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT store_id, store_name_fi
                            FROM admin_store
                            WHERE group_id = ? AND status = 'active';`,
                    values: params
                },
            ];

            const [results1, results2, results3] = await executeMultipleQueries(queries);

            chaincategory_idValuePairs = results1.map((row: any) => ({
                id: row.chain_cat_id,
                value: row.chain_cat_name
            }));

            chain_idValuePairs = results2.map((row: any) => ({
                id: row.chain_id,
                value: row.chain_name
            }));

            store_idValuePairs = results3.map((row: any) => ({
                id: row.store_id,
                value: row.store_name_fi
            }));

        } else if (req.query.chain_category && typeof req.query.chain_category === 'object') {
            const Params = req.query.chain_category as ParsedQs;
            const chaincatId = Params.id as string;
            const chaincatValue = Params.value as string;

            chaincategory_idValuePairs.push({ id: chaincatId, value: chaincatValue });

            const params = [chaincatId];

            const queries = [
                {
                    query: `SELECT ac.group_id, ag.group_name
                            FROM admin_chain ac
                            JOIN admin_group ag ON ac.group_id = ag.group_id
                            WHERE ac.chain_cat_id = ? AND ac.status = 'active' AND ag.status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT chain_id, chain_name
                            FROM admin_chain
                            WHERE chain_cat_id = ? AND status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT ast.store_id, ast.store_name_fi
                            FROM admin_chain ac
                            JOIN admin_store ast ON ac.chain_id = ast.chain_id
                            WHERE ac.chain_cat_id = ? AND ac.status = 'active' AND ast.status = 'active';`,
                    values: params
                },
            ];
            const [results1, results2, results3] = await executeMultipleQueries(queries);

            group_idValuePairs = results1.map((row: any) => ({
                id: row.group_id,
                value: row.group_name
            }));

            chain_idValuePairs = results2.map((row: any) => ({
                id: row.chain_id,
                value: row.chain_name
            }));

            store_idValuePairs = results3.map((row: any) => ({
                id: row.store_id,
                value: row.store_name_fi
            }));
        } else if (req.query.chain && typeof req.query.chain === 'object') {
            const Params = req.query.chain as ParsedQs;
            const chainId = Params.id as string;
            const chainValue = Params.value as string;

            chain_idValuePairs.push({ id: chainId, value: chainValue });

            const params = [chainId];

            const queries = [
                {
                    query: `SELECT ac.group_id, ag.group_name
                            FROM admin_chain ac
                            JOIN admin_group ag ON ac.group_id = ag.group_id
                            WHERE ac.chain_id = ? AND ac.status = 'active' AND ag.status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT ac.chain_cat_id, acc.chain_cat_name
                            FROM admin_chain ac
                            JOIN admin_chain_category acc ON acc.chain_cat_id = ac.chain_cat_id
                            WHERE ac.chain_id = ? AND ac.status = 'active' AND acc.status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT store_id, store_name_fi
                            FROM admin_store
                            WHERE chain_id = ? AND status = 'active';`,
                    values: params
                },
            ];

            const [results1, results2, results3] = await executeMultipleQueries(queries);

            group_idValuePairs = results1.map((row: any) => ({
                id: row.group_id,
                value: row.group_name
            }));

            chaincategory_idValuePairs = results2.map((row: any) => ({
                id: row.chain_cat_id,
                value: row.chain_cat_name
            }));

            store_idValuePairs = results3.map((row: any) => ({
                id: row.store_id,
                value: row.store_name_fi
            }));

        } else if (req.query.store && typeof req.query.store === 'object') {
            const Params = req.query.store as ParsedQs;
            const storeId = Params.id as string;
            const storeValue = Params.value as string;

            store_idValuePairs.push({ id: storeId, value: storeValue });

            const params = [storeId];

            const queries = [
                {
                    query: `SELECT ast.group_id, ag.group_name
                            FROM admin_store ast
                            JOIN admin_group ag ON ast.group_id = ag.group_id
                            WHERE ast.store_id = ? AND ast.status = 'active' AND ag.status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT ast.chain_id, ac.chain_name
                            FROM admin_store ast
                            JOIN admin_chain ac ON ast.chain_id = ac.chain_id
                            WHERE ast.store_id = ? AND ast.status = 'active' AND ac.status = 'active';`,
                    values: params
                },
                {
                    query: `SELECT ac.chain_cat_id, acc.chain_cat_name
                            FROM admin_store ast
                            JOIN admin_chain ac ON ast.chain_id = ac.chain_id
                            JOIN admin_chain_category acc ON ac.chain_cat_id = acc.chain_cat_id
                            WHERE ast.store_id = ? AND ast.status = 'active' AND ac.status = 'active' AND acc.status = 'active';`,
                    values: params
                },
            ];

            const [results1, results2, results3] = await executeMultipleQueries(queries);

            group_idValuePairs = results1.map((row: any) => ({
                id: row.group_id,
                value: row.group_name
            }));

            chain_idValuePairs = results2.map((row: any) => ({
                id: row.chain_id,
                value: row.chain_name
            }));

            chaincategory_idValuePairs = results3.map((row: any) => ({
                id: row.chain_cat_id,
                value: row.chain_cat_name
            }));

        } else {
            const queries = [
                {
                    query: `SELECT group_id, group_name
                FROM admin_group
                WHERE status = 'active';` },
                {
                    query: `SELECT chain_cat_id, chain_cat_name
                FROM admin_chain_category
                WHERE status = 'active';` },
                {
                    query: `SELECT chain_id, chain_name
                FROM admin_chain
                WHERE status = 'active';` },
                {
                    query: `SELECT store_id, store_name_fi
                FROM admin_store
                WHERE status = 'active';` },
            ];

            const [results1, results2, results3, results4] = await executeMultipleQueries(queries);

            group_idValuePairs = results1.map((row: any) => ({
                id: row.group_id,
                value: row.group_name
            }));

            chaincategory_idValuePairs = results2.map((row: any) => ({
                id: row.chain_cat_id,
                value: row.chain_cat_name
            }));

            chain_idValuePairs = results3.map((row: any) => ({
                id: row.chain_id,
                value: row.chain_name
            }));

            store_idValuePairs = results4.map((row: any) => ({
                id: row.store_id,
                value: row.store_name_fi
            }));
        }

        output = {
            // use Set for unique elements
            group: Array.from(new Set(group_idValuePairs.map(pair => JSON.stringify(pair))))
                .map(str => JSON.parse(str)),
            chain_category: Array.from(new Set(chaincategory_idValuePairs.map(pair => JSON.stringify(pair))))
                .map(str => JSON.parse(str)),
            chain: Array.from(new Set(chain_idValuePairs.map(pair => JSON.stringify(pair))))
                .map(str => JSON.parse(str)),
            store: Array.from(new Set(store_idValuePairs.map(pair => JSON.stringify(pair))))
                .map(str => JSON.parse(str))
        }

        console.log("data sent")

        res.status(200).send(output)
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;