import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import {
  Upload,
  UploadDocument,
} from 'src/database/mongoose/schemas/upload.schema';
import bull from 'bull';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name)
    private readonly _uploadModel: Model<UploadDocument>,
    @InjectQueue('csv-processing') private readonly _csvQueue: bull.Queue,
  ) {}

  public async execute(file: Express.Multer.File): Promise<object> {
    if (!file || file.mimetype !== 'text/csv') {
      throw new BadRequestException('Invalid file type.');
    }

    const uploadId = randomUUID();

    await new this._uploadModel({
      upload_id: uploadId,
      status: 'processing',
      total_records: null,
      processed_records: 0,
      valid_records: 0,
      errors: [],
    }).save();

    await this._csvQueue.add('process-file', {
      fileBuffer: file.buffer.toString('utf-8'),
      uploadId: uploadId,
    });

    return {
      upload_id: uploadId,
      status: 'processing',
      total_records: null,
      processed_records: 0,
      valid_records: 0,
      errors: [],
    };
  }
}
