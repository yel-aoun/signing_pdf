// src/pdf-signing/pdf-signing.service.ts

import { Injectable } from '@nestjs/common';
import signer from 'node-signpdf';
import { plainAddPlaceholder } from 'node-signpdf/dist/helpers';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignedPdf } from './signed-pdf.entity';

@Injectable()
export class PdfSigningService {
    constructor(
        @InjectRepository(SignedPdf)
        private signedPdfRepository: Repository<SignedPdf>,
      ) {}
    
      async signAndStorePdf(inputPath: string, certPath: string, certPassword: string, filename: string): Promise<SignedPdf> {
        // Sign the PDF
        const signedPdfBuffer = await this.signPdf(inputPath, certPath, certPassword);
        
        // Convert Buffer to Blob
        const signedPdfBlob = new Blob([signedPdfBuffer], { type: 'application/pdf' });
    
        const signedPdf = new SignedPdf();
        signedPdf.filename = filename;
        signedPdf.pdf_data = signedPdfBlob;
    
        return this.signedPdfRepository.save(signedPdf);
    }
    
      async listSignedPdfs(): Promise<Partial<SignedPdf>[]> {
        return this.signedPdfRepository
            .createQueryBuilder('signedPdf')
            .select(['signedPdf.id', 'signedPdf.filename', 'signedPdf.created_at'])
            .getMany();
    }
    
    async retrieveSignedPdf(id: number): Promise<SignedPdf> {
        const pdf = await this.signedPdfRepository.findOneBy({ id });
        if (pdf && Buffer.isBuffer(pdf.pdf_data)) {
            // Convert Buffer back to Blob
            console.log("code heeeere");
            pdf.pdf_data = new Blob([pdf.pdf_data], { type: 'application/pdf' });

        }
        return pdf;
    }
  async signPdf(inputPath: string, certPath: string, certPassword: string): Promise<Buffer> {
    try {
      // Read the PDF file
      let pdfBuffer = await fs.promises.readFile(inputPath);

      // Add placeholder for signature
      pdfBuffer = plainAddPlaceholder({
        pdfBuffer,
        reason: 'Digital Signature',
        contactInfo: 'example@example.com',
        name: 'John Doe',
        location: 'New York',
      });

      // Read the certificate file
      const certBuffer = await fs.promises.readFile(certPath);

      // Sign the PDF
      const signedPdf = await signer.sign(pdfBuffer, certBuffer, {
        passphrase: certPassword,
      });

      // Write the signed PDF to the output path
    //   await fs.promises.writeFile(outputPath, signedPdf);

      console.log('PDF signed successfully!');
      return signedPdf;
    } catch (error) {
      console.error('Error signing PDF:', error);
      throw error;
    }
  }
}