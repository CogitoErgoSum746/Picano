import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { executeQueries } from '../db_connections/haukka_db';

const router: Router = Router();

router.post('/finalCSV', async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (!data || !data.campaign || !data.products || !Array.isArray(data.products)) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const { campaign, products } = data;

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const current_time_ = currentDate.getHours().toString().padStart(2, '0') +
                             currentDate.getMinutes().toString().padStart(2, '0') +
                             currentDate.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${day}/${month}/${year}`;

        const name1 = campaign.chain;
        const name2 = 'Campaigns';

        const fileName = `${year}-${month}-${day}${current_time_}${name1}${name2}.csv`;
        const filePath = '/home/csv_account/_Campaigns_/' + fileName;


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
                .map((result) => (result[0] ? Object.values(result[0])[0] : ""))
                .map((value: number | string) => value);



            return [group_id, chain_cat_id, chain_id, store_id];
        }

        const campaignIds = await getCampaignData(campaign);

        let csvData = 'groupId,groupName,chainCategory,chainCategoryID,chainName,chainId,storeName,storeId,productId,brandName,productNameFI,productNameSE,productDescriptionFI,productDescriptionSE,campaignQty,discountedProductPrice,restrictions,appCategory1,productCategory1,productCategory2,productCategory3,productPrice,EAN,pictureURL,pictureId,campaignStartDate,campaignEndDate,campaignActive,product_url,createdAt,updatedAt\n';

        products.forEach((product: any) => {
            let fromDate = campaign.from;
            let toDate = campaign.to;

            if (product.to && product.from) {
                fromDate = product.from;
                toDate = product.to;
            }

            csvData += `${campaignIds[0]},"${campaign.group}","${campaign.category}",${campaignIds[1]},"${campaign.chain}",${campaignIds[2]},"${campaign.store}",${campaignIds[3]},,"${product.brand}","${product.name}",,"${product.description}",,"${product.campaignQuantity}","${product.discountedPrice}","${product.restrictions}",,"${product.category}",,,,,,,${fromDate},${toDate},,,${formattedDate},\n`;
        });

        fs.writeFileSync(filePath, csvData);

        res.status(200).json({ success: true, message: 'CSV file saved successfully', filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
