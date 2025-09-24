import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Upload,
  UploadDocument,
} from 'src/database/mongoose/schemas/upload.schema';

@Injectable()
export class GetByIdService {
  constructor(
    @InjectModel(Upload.name) private _uploadModel: Model<UploadDocument>,
  ) {}

  public async execute(uploadId: string): Promise<object> {
    const upload = await this._uploadModel
      .findOne({ upload_id: uploadId })
      .exec();

    if (!upload) {
      throw new NotFoundException(`Upload with ID "${uploadId}" not found.`);
    }

    const filteredErrors = upload.errors.map((error) => ({
      line: error.line,
      field: error.field,
      message: error.message,
      value: error.value,
    }));

    return {
      upload_id: upload.upload_id,
      status: upload.status,
      total_records: upload.total_records,
      processed_records: upload.processed_records,
      valid_records: upload.valid_records,
      errors: filteredErrors,
    };
  }
}
