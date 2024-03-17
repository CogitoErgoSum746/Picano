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

// GET route to get similar historic products with provided field values.
router.get("/similar-products", async (req: Request, res: Response) => {
    const { 
        name, brand, description, discountedPrice,
        campaignQuantity, restrictions, category
    } = req.query;

    // build the WHERE part of the query.
    // this is done manually to avoid SQL injection.
    const whereQueryStrings = [];
    const values = [];
    if (name) {
        whereQueryStrings.push("LOWER(productNameFI) LIKE ?");
        values.push(`%${name.toString().toLowerCase()}%`);
    }
    if (brand) {
        whereQueryStrings.push("LOWER(brandName) LIKE ?");
        values.push(`%${brand.toString().toLowerCase()}%`);
    }
    if (category) {
        whereQueryStrings.push("LOWER(productCategory1) LIKE ?");
        values.push(`%${category.toString().toLowerCase()}%`);
    }
    if (description) {
        whereQueryStrings.push("LOWER(productDesriptionFI) LIKE ?");
        values.push(`%${description.toString().toLowerCase()}%`);
    }
    if (restrictions) {
        whereQueryStrings.push("LOWER(restrictions) LIKE ?");
        values.push(`%${restrictions.toString().toLowerCase()}%`);
    }
    if (discountedPrice) {
        whereQueryStrings.push("LOWER(discountedProductPrice) LIKE ?");
        values.push(`%${discountedPrice.toString().toLowerCase()}%`);
    }
    if (campaignQuantity) {
        whereQueryStrings.push("LOWER(campaignQty) LIKE ?");
        values.push(`%${campaignQuantity.toString().toLowerCase()}%`);
    }

    // If no data is provided to query from, return.
    if (whereQueryStrings.length <= 0) 
        return res.sendStatus(400);

    const query = `
SELECT productNameFI, brandName, productCategory1, productDescriptionFI, 
       restrictions, discountedProductPrice, campaignQty
FROM Final_products_csv
WHERE ${whereQueryStrings.join(" AND ")};
    `;

    const data = await executeQuery(query, values);
    res.json(data);
});

export default router;