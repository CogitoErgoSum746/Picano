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

        // Create campaign_details object
        const campaign_details: {
            group: string;
            category: string;
            chain: string;
            store: string;
        } = {
            group: campaign.group,
            category: campaign.category,
            chain: campaign.chain,
            store: campaign.store
        };

        // Create product_details array with explicit types
        interface ProductDetails {
            id: string;
            name: string;
            brand: string;
            description: string;
            discountedPrice: string;
            campaignQuantity: string;
            restrictions: string;
            category: string;
        }

        const product_details: ProductDetails[] = products.map((product: any) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            description: product.description,
            discountedPrice: product.discountedPrice,
            campaignQuantity: product.campaignQuantity,
            restrictions: product.restrictions,
            category: product.category
        }));

        console.log(campaign_details)
        console.log(product_details)

        // Array to store values for bulk insert
        const valuesArray: any[][] = [];

    //     // Iterate over product_details and populate valuesArray
    //     product_details.forEach((product: ProductDetails) => {
    //         const currentDate = new Date();
    //         const values: any[] = [
    //             campaign_details.group,
    //             campaign_details.category,
    //             campaign_details.chain,
    //             campaign_details.store,
    //             product.brand,
    //             product.name,
    //             product.description,
    //             product.discountedPrice,
    //             product.campaignQuantity,
    //             product.restrictions,
    //             product.category,
    //             currentDate,
    //             currentDate,
    //             currentDate
    //         ];
    //         valuesArray.push(values);
    //     });

    //     const placeholders = Array.from({ length: 14 }, () => '?').join(', ');

    //     // Insert query template
    //     const insertQuery = `
    // INSERT INTO final_products (
    //     group_name,
    //     chain_category,
    //     chain_name,
    //     store_name_fi,
    //     brand_name,
    //     product_name,
    //     product_description,
    //     discounted_product_price,
    //     campaign_quantity,
    //     restrictions,
    //     product_category,
    //     campaign_start_date,
    //     campaign_end_date,
    //     created_at
    // ) VALUES (${placeholders})`;


    //     // Execute the insert query with the flattenedValuesArray
    //     await executeQuery(insertQuery, [valuesArray]);

        res.status(200).json({ success: true, message: 'Data inserted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;



// const values = data.map(row => {
//     return `(
//         '${row.group_name}',
//         '${row.chain_category}',
//         '${row.chain_name}',
//         '${row.store_name_fi}',
//         '${row.brand_name}',
//         '${row.product_name}',
//         '${row.product_description}',
//         '${row.discounted_product_price}',
//         '${row.campaign_quantity}',
//         '${row.restrictions}',
//         '${row.product_category}',
//         '${row.campaign_start_date}',
//         '${row.campaign_end_date}',
//         NOW()
//     )`;
// }).join(', ');

// const insertQuery = `
//     INSERT INTO final_products (
//         group_name,
//         chain_category,
//         chain_name,
//         store_name_fi,
//         brand_name,
//         product_name,
//         product_description,
//         discounted_product_price,
//         campaign_quantity,
//         restrictions,
//         product_category,
//         campaign_start_date,
//         campaign_end_date,
//         created_at
//     ) VALUES ${values}
// `;

// // Execute the insert query
// await executeQuery(insertQuery);
