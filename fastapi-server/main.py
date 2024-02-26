from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import fitz
from io import BytesIO
from PIL import Image
import base64

app = FastAPI()

# Configure CORS settings
origins = [
    'http://161.97.78.88', 'http://localhost:4200'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['GET', 'POST', 'PUT', 'DELETE'],
    # options_success_status=204,
)

def convert_pdf_to_png(pdf_bytes, zoom=2):
    doc = fitz.open(stream=pdf_bytes)
    i = 0
    images = []

    for page in doc:
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        pil_image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # Convert PIL image to bytes
        image_bytes = BytesIO()
        pil_image.save(image_bytes, format="PNG")
        images.append(base64.b64encode(image_bytes.getvalue()).decode("utf-8"))

        i += 1

    return i, images

@app.post("/pdf-to-images")
async def convert_pdf_to_png_route(pdf: UploadFile = File(...), zoom: int = 2):
    try:
        pdf_bytes = await pdf.read()

        pages_count, images = convert_pdf_to_png(pdf_bytes, zoom)

        return { "images": images}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8002)