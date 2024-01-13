import express, { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v1 as Vision } from '@google-cloud/vision';
import { config } from "dotenv";
config();

const router: Router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

const client = new Vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

router.post('/vision', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).send('No image file provided');
        }

        // Convert the blob to text using the Vision API
        const [result] = await client.textDetection({
            image: { content: req.file.buffer },
        });

        const text = result.fullTextAnnotation?.text || 'No text found in the image';

        res.status(200).send(text);
    } catch (error) {
        console.error('Error in vision api:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;