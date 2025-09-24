import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './services/upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Upload,
  UploadSchema,
} from 'src/database/mongoose/schemas/upload.schema';
import { BullModule } from '@nestjs/bull';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/database/mongoose/schemas/prescription.schema';
import { UploadProcessorService } from './services/upload-processor.service';
import { GetByIdService } from './services/get-by-id.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Upload.name, schema: UploadSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
    BullModule.registerQueue({
      name: 'csv-processing',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadProcessorService, GetByIdService],
})
export class UploadModule {}
