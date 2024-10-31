// src/pdf-signing/pdf-signing.controller.ts

import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { PdfSigningService } from './pdf-signing.service';
import { Response } from 'express';
const fs = require('fs');



@Controller('pdf')
export class PdfSigningController {
  constructor(private readonly pdfSigningService: PdfSigningService) {}

  @Post('sign')
  async signPdf(@Body() body: { inputPath: string; outputPath: string; certPath: string; certPassword: string }) {
    const { inputPath, outputPath, certPath, certPassword } = body;
    await this.pdfSigningService.signAndStorePdf(inputPath, certPath, certPassword, outputPath);
    return { message: 'PDF signed successfully' };
  }
  @Get('list')
  async listSignedPdfs() {
    const pdfs = await this.pdfSigningService.listSignedPdfs();
    return pdfs.map(pdf => ({
        id: pdf.id,
        filename: pdf.filename,
        created_at: pdf.created_at
    }));
}

@Get('retrieve/:id')
async retrieveSignedPdf(@Param('id') id: number, @Res() res: Response) {
    const signedPdf = await this.pdfSigningService.retrieveSignedPdf(id);
    if (!signedPdf) {
        res.status(404).send('PDF not found');
        return;
    }

    // Convert Blob to Buffer for sending response
    const arrayBuffer = await signedPdf.pdf_data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync('output.txt', buffer);
    console.log('File written successfully!');

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${signedPdf.filename}"`,
    });
    res.send(buffer);
}
}