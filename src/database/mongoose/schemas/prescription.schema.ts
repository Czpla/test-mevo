import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrescriptionDocument = Prescription & Document;

@Schema()
export class Prescription {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  patient_cpf: string;

  @Prop({ required: true })
  doctor_crm: string;

  @Prop({ required: true })
  doctor_uf: string;

  @Prop({ required: true })
  medication: string;

  @Prop({ required: true, default: false })
  controlled: boolean;

  @Prop({ required: true })
  dosage: string;

  @Prop({ required: true })
  frequency: number;

  @Prop({ required: true })
  duration: number;

  @Prop()
  notes?: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
