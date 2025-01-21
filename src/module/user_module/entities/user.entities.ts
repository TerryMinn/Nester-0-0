import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User> & {
  checkPassword: (credentialPass: string, hashed: string) => Promise<boolean>;
};

@Schema()
class OAuthProvider {
  @Prop({ type: String, required: true })
  provider: string;

  @Prop({ type: String, required: true })
  providerId: string;

  @Prop({ type: String })
  accessToken?: string;

  @Prop({ type: String })
  refreshToken?: string;
}

const OAuthProviderSchema = SchemaFactory.createForClass(OAuthProvider);

@Schema()
class Profile {
  @Prop()
  picture?: string;

  @Prop()
  phone?: string;

  @Prop()
  bio?: string;
}

const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
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

  @Prop({ type: ProfileSchema, default: {} })
  profile: Profile;

  @Prop({ type: [OAuthProviderSchema], default: [], select: false })
  oauth_providers?: OAuthProvider[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    default: null,
    select: false,
  })
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
