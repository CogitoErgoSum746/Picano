import multer from 'multer';
import pdfjsLib from 'pdfjs-dist';
import { Readable } from 'stream';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// router.post('/upload-pdf', upload.single('pdfFile'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file provided' });
//         }

//         // Access the uploaded PDF file in req.file.buffer
//         const pdfBuffer = req.file.buffer;

//         // Perform PDF processing (convert pages to blobs/images)
//         const pdfDoc = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
//         const numPages = pdfDoc.numPages;

//         // Retrieve blobs/images from each page
//         const pageImages: Buffer[] = [];
//         for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
//             const page = await pdfDoc.getPage(pageNumber);
//             const pageData = await page.getData();
//             const img = Buffer.from(new Uint8Array(pageData));
//             pageImages.push(img);
//         }

//         // Respond back to the client with the processed data
//         res.json({ numPages, pageImages });
//     } catch (error) {
//         console.error('Error processing PDF:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


export default router;