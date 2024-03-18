import multer from 'multer';
import { v1 as Vision } from '@google-cloud/vision';

import { Router, Request, Response } from 'express';
import { executeQuery } from '../db_connections/haukka_db';
const router: Router = Router();

const upload = multer({ storage: multer.memoryStorage() });

const visionClient = new Vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

router.post('/vision', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send('No image file provided');
        }

        // Convert the blob to text using the Vision API
        const [result] = await visionClient.textDetection({
            image: { content: req.file.buffer },
        });

        const text = result.fullTextAnnotation?.text;

        res.status(200).json({ success: true, 'text': text });
    } catch (error) {
        console.error('Error in vision api:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// maps table fields to request keys.
const TABLE_MAP: Record<string, string> = {
    "brandName": "brand",
    "campaignQty": "campaignQuantity",
    "restrictions": "restrictions",
    "productNameFI": "name",
    "productCategory1": "category",
    "productDescriptionFI": "description",
    "discountedProductPrice": "discountedPrice",
    "campaignStartDate": "from",
    "campaignEndDate": "to",
};

// GET route to get similar historic products with provided field values.
router.get("/similar-products", async (req: Request, res: Response) => {
    const params = req.query;

    // build the WHERE part of the query.
    // this is done manually to avoid SQL injection.
    const whereQueryStrings = [];
    const values = [];
    for (const [field, key] of Object.entries(TABLE_MAP)) {
        // Ignore from and to values while filtering data.
        if (key === 'from' || key === 'to') continue;

        const value = params[key];
        if (value) {
            const queryString = `LOWER(${field}) LIKE ?`;
            whereQueryStrings.push(queryString);
            values.push(`%${value.toString().toLowerCase()}%`);
        }
    }

    // If no data is provided to query from, return.
    if (whereQueryStrings.length <= 0) 
        return res.sendStatus(400);

    const query = `
SELECT productNameFI, brandName, productCategory1, 
       productDescriptionFI, restrictions, discountedProductPrice, 
       campaignQty, campaignStartDate, campaignEndDate
FROM Final_products_csv
WHERE ${whereQueryStrings.join(" AND ")};
    `;

    const products = await executeQuery(query, values);

    // convert fields back into their corresponding keys
    // for all products in data
    const response = products.map((p: any) => {
        const product: Record<string, string> = {};

        for (const [field, key] of Object.entries(TABLE_MAP)) 
            product[key] = p[field];
        
        // Extract only the date part of TimeStamp.
        // Ideally, the field itself should be Date instead of TimeStamp.
        if (product.from)
            product.from = new Date(product.from).toISOString().substring(0, 10);
        if (product.to)
            product.to = new Date(product.to).toISOString().substring(0, 10);

        return product;
    });


    res.json(response);
});

export default router;