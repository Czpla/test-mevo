import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema()
export class Upload {
  @Prop({ unique: true })
  upload_id: string;

  @Prop({ default: 'processing' })
  status: 'processing' | 'completed' | 'failed';

  @Prop()
  total_records: number;

  @Prop()
  processed_records: number;

  @Prop()
  valid_records: number;

  @Prop({
    type: [{ line: Number, field: String, message: String, value: String }],
  })
  errors: Array<{
    line: number;
    field: string;
    message: string;
    value: string;
  }>;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
