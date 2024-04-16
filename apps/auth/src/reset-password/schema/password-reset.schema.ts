import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class PasswordReset extends AbstractDocument {
  @Prop({ ref: 'Users', required: true })
  user_id: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expires_at: Date;

  @Prop({ required: true, default: Date.now })
  created_at?: Date;

};

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
