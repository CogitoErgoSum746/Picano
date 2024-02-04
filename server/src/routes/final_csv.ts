import { Router, Request, Response } from 'express';
import { executeQuery, executeMultipleQueries } from '../db_connections/haukka_db';

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

        async function getCampaignData(campaignData: any): Promise<number[]> {
            const queries = [
                {
                    query: `SELECT group_id
                            FROM admin_group
                            WHERE group_name=? AND status = 'active';`,
                    values: campaignData.group
                },
                {
                    query: `SELECT chain_cat_id
                            FROM admin_chain_category
                            WHERE chain_cat_name=? AND status = 'active';`,
                    values: campaignData.category
                },
                {
                    query: `SELECT chain_id
                            FROM admin_chain
                            WHERE chain_name=? AND status = 'active';`,
                    values: campaignData.chain
                },
                {
                    query: `SELECT store_id
                            FROM admin_store
                            WHERE store_name_fi=? AND status = 'active';`,
                    values: campaignData.store
                },
            ];

            const [group_id, chain_cat_id, chain_id, store_id] = await executeMultipleQueries(queries);

            return [group_id, chain_cat_id, chain_id, store_id];
        }

        const campaignIds = await getCampaignData(campaign);

        let values = products.map((product: any) => 
            ([ campaign.group, campaign.category, campaign.chain, campaign.store,
            product.brand, product.name, product.description, product.discountedPrice,
            product.campaignQuantity, product.restrictions, product.category,
            product.from, product.to, campaignIds[0], campaignIds[1], campaignIds[2], campaignIds[3]  ])
        );

        values = values.flat()



        const insertQuery = `
INSERT INTO Final_products_csv (groupname, chainCategory, chain, storeNameFI, brandName, 
                            productNameFI, productDescriptionFI, discountedProductPrice, 
                            campaignQty, restrictions, productCategory1, campaignStartDate, campaignEndDate
                            groupId, chainCategoryId, chainId, storeId) 
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
