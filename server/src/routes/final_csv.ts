import { Router, Request, Response } from 'express';
import { executeQuery } from '../db_connections/haukka_db';

const router: Router = Router();

router.post('/finalCSV', async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (!data || !data.campaign || !data.products || !Array.isArray(data.products)) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const { campaign, products } = data;

        const perRowPlaceholder = `(${Array.from({ length: 17 }, () => '?').join(', ')})` ;
        const placeholder = products.map(() => perRowPlaceholder).join(',');

        let values = products.map((product: any) => 
            ([ campaign.group, campaign.category, campaign.chain, campaign.store,
            product.brand, product.name, product.description, product.discountedPrice,
            product.campaignQuantity, product.restrictions, product.category,
            product.from, product.to, groupId, categoryId, chainId, storeId ])
        );

        values = values.flat()



        const insertQuery = `
INSERT INTO final_products (group_name, chain_category, chain_name, store_name_fi, brand_name, 
                            product_name, product_description, discounted_product_price, 
                            campaign_quantity, restrictions, product_category, campaign_start_date, campaign_end_date
                            group_id, chain_category_id, chain_id, store_id) 
VALUES ${placeholder};
`;
        await executeQuery(insertQuery, values);

        res.status(200).json({ success: true, message: 'Data inserted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
