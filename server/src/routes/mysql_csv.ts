import { Router, Request, Response } from 'express';
import { executeQuery, executeMultipleQueries, executeQueries } from '../db_connections/haukka_db';

const router: Router = Router();

router.post('/finalCSV2', async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (!data || !data.campaign || !data.products || !Array.isArray(data.products)) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const { campaign, products } = data;

        const perRowPlaceholder = `(${Array.from({ length: 17 }, () => '?').join(', ')})`;
        const placeholder = products.map(() => perRowPlaceholder).join(',');

        async function getCampaignData(campaignData: any) { //: Promise<number[]>
            const queries = [
                {
                    query: `SELECT group_id
                            FROM admin_group
                            WHERE group_name=? AND status = 'active';`,
                    values: [campaignData.group]
                },
                {
                    query: `SELECT chain_cat_id
                            FROM admin_chain_category
                            WHERE chain_cat_name=? AND status = 'active';`,
                    values: [campaignData.category]
                },
                {
                    query: `SELECT chain_id
                            FROM admin_chain
                            WHERE chain_name=? AND status = 'active';`,
                    values: [campaignData.chain]
                },
                {
                    query: `SELECT store_id
                            FROM admin_store
                            WHERE store_name_fi=? AND status = 'active';`,
                    values: [campaignData.store]
                },
            ];

            let results: Array<Array<{ [key: string]: number }>> = [];

            results = await executeQueries(queries);

            const [group_id, chain_cat_id, chain_id, store_id] = results
                .map((result) => (result[0] ? Object.values(result[0])[0] : undefined))
                .map((value: number | undefined) => value || null);


            return [group_id, chain_cat_id, chain_id, store_id];
        }

        const campaignIds = await getCampaignData(campaign);

                let values = products.map((product: any) => 
                {
                    let fromDate = campaign.from
                    let toDate = campaign.to

                    if (product.to && product.from) {
                        fromDate = product.from
                        toDate = product.to
                    }

                    const filteredValues = [
                        campaign.group, campaign.category, campaign.chain, campaign.store,
                        product.brand, product.name, product.description, product.discountedPrice,
                        product.campaignQuantity, product.restrictions, product.category,
                        fromDate, toDate, campaignIds[0], campaignIds[1], campaignIds[2], campaignIds[3],
                    ];

                    return filteredValues.map((value) => (value !== undefined ? value : null));
                }
                );

                values = values.flat()

                const insertQuery = `
        INSERT INTO Final_products_csv (groupname, chainCategory, chain, storeNameFI, brandName, productNameFI, productDescriptionFI, discountedProductPrice, campaignQty, restrictions, productCategory1, campaignStartDate, campaignEndDate, groupId, chainCategoryId, chainId, storeId) 
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
