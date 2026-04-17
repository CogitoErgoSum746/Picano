# Picano

Picano is a multi-service document annotation workflow built around Angular, Node/TypeScript, FastAPI, Google Vision OCR, and MySQL-backed lookup APIs. The project appears to be designed for campaign or product-material processing where users upload PDFs or images, extract text, enrich product metadata, and save structured output.

## Architecture

- `client/annotator/`
  Angular application for authentication, chain selection, and product extraction flows.
- `server/`
  Express + TypeScript API for auth, Google Vision OCR, dropdown data, similar-product lookup, and CSV / MySQL persistence.
- `fastapi-server/`
  FastAPI helper service that converts uploaded PDFs into PNG images for downstream annotation.

## Main backend flows

- `POST /auth/login`
- `POST /vision`
- `GET /similar-products`
- `GET /product_category`
- `GET /auto-dropdown`
- `POST /finalCSV`
- `POST /finalCSV2`

## Tech stack

- Angular
- Node.js
- Express
- TypeScript
- FastAPI
- Google Cloud Vision
- MySQL

## Local setup

### 1. Express API

Create `server/.env` from `server/.env.example` and fill in the real values.

```bash
cd server
npm install
npm run dev
```

### 2. FastAPI PDF service

```bash
cd fastapi-server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

### 3. Angular client

```bash
cd client/annotator
npm install
npm start
```

## Environment variables

### `server/.env`

- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_DATABASE`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `CORS_ORIGINS`
- `CSV_EXPORT_DIR`

### FastAPI service

- `CORS_ORIGINS`
- `PORT`

## Repo hygiene note

The tracked Google Vision service-account file was removed from source control. Keep credentials outside the repo and point `GOOGLE_APPLICATION_CREDENTIALS` to the local file path on the machine running the service.
