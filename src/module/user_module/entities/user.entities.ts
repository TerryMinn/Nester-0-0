import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User> & {
  checkPassword: (credentialPass: string, hashed: string) => Promise<boolean>;
};

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  username: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
    select: false,
    minlength: 4,
    maxlength: 25,
  })
  password: string;

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop({ type: Object, default: {} })
  profile: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed, default: [] })
  device: [];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, default: null })
  created_by: User;

  async checkPassword(
    credentialPass: string,
    hashed: string,
  ): Promise<boolean> {
    return await bcrypt.compare(credentialPass, hashed);
  }
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Attach methods to the schema
UserSchema.methods.checkPassword = async function (
  credentialPass: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(credentialPass, hashed);
};

export { UserSchema };
