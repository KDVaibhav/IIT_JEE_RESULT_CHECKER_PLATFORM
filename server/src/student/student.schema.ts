import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Student extends Document {
  @Prop() name: string;
  @Prop() email: string;
  @Prop({ unique: true }) hallTicketNo: string;
  @Prop() maths: number;
  @Prop() physics: number;
  @Prop() chemistry: number;
  @Prop() total: number;
  @Prop() rank: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
