import { Process, Processor } from '@nestjs/bull';
import bull from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Upload,
  UploadDocument,
} from 'src/database/mongoose/schemas/upload.schema';
import { parse } from 'csv-parse/sync';
import {
  PrescriptionCsvRecord,
  validatePrescription,
} from 'src/modules/upload/helpers/validation-rules.helper';
import { PrescriptionDocument } from 'src/database/mongoose/schemas/prescription.schema';

@Processor('csv-processing')
export class UploadProcessorService {
  constructor(
    @InjectModel(Upload.name)
    private readonly _uploadModel: Model<UploadDocument>,
    @InjectModel('Prescription')
    private readonly _prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  @Process('process-file')
  public async execute(
    job: bull.Job<{ fileBuffer: string; uploadId: string }>,
  ) {
    const { fileBuffer, uploadId } = job.data;
    const errors: Upload['errors'] = [];

    let validRecordsCount = 0;

    try {
      const records: PrescriptionCsvRecord[] = parse(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
      });

      const prescriptions: PrescriptionCsvRecord[] = [];

      for (let i = 0; i < records.length; i++) {
        const lineNumber = i + 2;
        const record = records[i];
        const validationResult = validatePrescription(record);

        if (validationResult.isValid) {
          validRecordsCount++;

          prescriptions.push(validationResult.validatedData);
        } else {
          if (validationResult.errorField) {
            errors.push({
              line: lineNumber,
              field: validationResult.errorField,
              message: validationResult.errorMessage ?? 'Validation error.',
              value: record[validationResult.errorField],
            });
          } else {
            errors.push({
              line: lineNumber,
              field: 'unknown',
              message:
                validationResult.errorMessage || 'Unknown validation error.',
              value: 'unknown',
            });
          }
        }
      }

      await this._uploadModel.updateOne(
        { upload_id: uploadId },
        {
          $set: {
            status: 'completed',
            total_records: records.length,
            processed_records: records.length,
            valid_records: validRecordsCount,
            errors: errors,
          },
        },
      );

      await this._prescriptionModel.insertMany(prescriptions);
    } catch (error) {
      console.error('Error processing CSV:', error);

      await this._uploadModel.updateOne(
        { upload_id: uploadId },
        {
          $set: {
            status: 'failed',
            total_records: null,
            processed_records: 0,
            valid_records: 0,
            errors: null,
          },
        },
      );
    }
  }
}
