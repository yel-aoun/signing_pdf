# signing_pdf

# ENV
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pdf_user
DB_PASSWORD=securepassword
DB_DATABASE=pdf_signing
```



# PDF Signing API

A NestJS-based API for signing PDF documents using a `.p12` certificate, storing them in a database, and providing endpoints to list and retrieve signed PDFs.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Overview](#api-overview)
  - [POST /pdf/sign](#post-pdfsign)
  - [GET /pdf/list](#get-pdflist)
  - [GET /pdf/retrieve/:id](#get-pdfretrieveid)
- [Examples](#examples)
  - [Sign a PDF](#sign-a-pdf)
  - [List Signed PDFs](#list-signed-pdfs)
  - [Retrieve a Signed PDF](#retrieve-a-signed-pdf)


## Getting Started

### Prerequisites
- **Node.js** and **npm**: Ensure Node.js and npm are installed.
- **NestJS**: This project is built with NestJS. If you haven’t installed it globally:
  ```bash
  npm i -g @nestjs/cli

API Overview
POST /pdf/sign
Signs a PDF and stores the signed version.

Endpoint: /pdf/sign
Method: POST
Body Parameters:
inputPath: (string) Path to the original PDF file.
outputPath: (string) Path where the signed PDF will be saved.
certPath: (string) Path to the .p12 certificate file.
certPassword: (string) Password for the .p12 certificate.
Response:
200 OK: { "message": "PDF signed successfully" }
400 Bad Request: { "message": "Validation error or missing parameters" }
GET /pdf/list
Lists all stored signed PDFs.

Endpoint: /pdf/list
Method: GET
Response:
200 OK: Returns an array of signed PDFs with id, filename, and created_at fields.
GET /pdf/retrieve/
Retrieves a signed PDF by its id and returns it as a downloadable file.

Endpoint: /pdf/retrieve/:id
Method: GET
Path Parameter:
id (integer): The ID of the PDF to retrieve.
Response:
200 OK: Returns the PDF file with a Content-Disposition header for download.
404 Not Found: { "message": "PDF not found" }

###Examples
Sign a PDF
To sign a PDF, make a POST request to /pdf/sign with the required parameters.

Example Request
Using curl:

```bash
curl -X POST http://localhost:3000/pdf/sign \
  -H "Content-Type: application/json" \
  -d '{
        "inputPath": "path/to/input.pdf",
        "outputPath": "path/to/output_signed.pdf",
        "certPath": "path/to/certificate.p12",
        "certPassword": "your_cert_password"
      }'
```

Expected Response
```bash

  "message": "PDF signed successfully"
```


List Signed PDFs
To view all signed PDFs, send a GET request to /pdf/list.

Example Request
```bash
curl -X GET http://localhost:3000/pdf/list
```

Example Response
```bash
[
  {
    "id": 1,
    "filename": "output_signed.pdf",
    "created_at": "2024-10-27T12:34:56.789Z"
  },
  {
    "id": 2,
    "filename": "another_signed.pdf",
    "created_at": "2024-10-28T14:20:00.000Z"
  }
]
```

Retrieve a Signed PDF
Retrieve a signed PDF by its id by sending a GET request to /pdf/retrieve/:id.

Example Request
```bash
curl -X GET http://localhost:3000/pdf/retrieve/1 -o retrieved_signed.pdf
```
