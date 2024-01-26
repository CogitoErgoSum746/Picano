import { Router, Request, Response } from 'express';
import { executeQuery } from '../db_connections/haukka_db';

const router: Router = Router();

router.post('/finalCSV', async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const values = data.map(row => {
            return `(
                '${row.group_name}',
                '${row.chain_category}',
                '${row.chain_name}',
                '${row.store_name_fi}',
                '${row.brand_name}',
                '${row.product_name}',
                '${row.product_description}',
                '${row.discounted_product_price}',
                '${row.campaign_quantity}',
                '${row.restrictions}',
                '${row.product_category}',
                '${row.campaign_start_date}',
                '${row.campaign_end_date}',
                NOW()
            )`;
        }).join(', ');

        const insertQuery = `
            INSERT INTO final_products (
                group_name,
                chain_category,
                chain_name,
                store_name_fi,
                brand_name,
                product_name,
                product_description,
                discounted_product_price,
                campaign_quantity,
                restrictions,
                product_category,
                campaign_start_date,
                campaign_end_date,
                created_at
            ) VALUES ${values}
        `;

        // Execute the insert query
        await executeQuery(insertQuery);

        res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

// [
//     {
//       "group_name": "Electronics",
//       "chain_category": "Tech",
//       "chain_name": "GadgetsRUs",
//       "store_name_fi": "Tech Haven",
//       "brand_name": "FutureTech",
//       "product_name": "Smartphone X",
//       "product_description": "High-end smartphone with advanced features",
//       "discounted_product_price": "699.99",
//       "campaign_quantity": "100",
//       "restrictions": "None",
//       "product_category": "Mobile Devices",
//       "campaign_start_date": "2024-02-01",
//       "campaign_end_date": "2024-02-28"
//     },
//     {
//       "group_name": "Electronics2",
//       "chain_category": "Tech2",
//       "chain_name": "GadgetsRUs2",
//       "store_name_fi": "Tech Haven2",
//       "brand_name": "FutureTech2",
//       "product_name": "Smartphone X2",
//       "product_description": "High-end smartphone with advanced features2",
//       "discounted_product_price": "699.992",
//       "campaign_quantity": "1002",
//       "restrictions": "None2",
//       "product_category": "Mobile Devices2",
//       "campaign_start_date": "2024-03-01",
//       "campaign_end_date": "2024-03-28"
//     }
//   ]