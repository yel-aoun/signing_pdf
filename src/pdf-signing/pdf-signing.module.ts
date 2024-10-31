// src/pdf-signing/pdf-signing.module.ts

import { Module } from '@nestjs/common';
import { PdfSigningService } from './pdf-signing.service';
import { PdfSigningController } from './pdf-signing.controller';
import { SignedPdf } from './signed-pdf.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([SignedPdf]) // Register the SignedPdf entity with TypeORM
      ],
      providers: [PdfSigningService],
      controllers: [PdfSigningController],
})
export class PdfSigningModule {}