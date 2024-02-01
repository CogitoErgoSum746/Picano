from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import fitz
from io import BytesIO
from PIL import Image
import base64

app = FastAPI()

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

@app.post("/convert_pdf_to_png")
async def convert_pdf_to_png_route(file: UploadFile = File(...), zoom: int = 2):
    try:
        pdf_bytes = await file.read()

        pages_count, images = convert_pdf_to_png(pdf_bytes, zoom)

        return { "page_count": {pages_count}, "images_array": images}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8002)