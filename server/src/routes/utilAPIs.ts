import multer from 'multer';
import { v1 as Vision } from '@google-cloud/vision';
import pdf2img from 'pdf-img-convert';
import fs from 'fs';

import { Router, Request, Response, NextFunction } from 'express';
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

export default router;