import { prop, getModelForClass, modelOptions, Ref, ReturnModelType } from '@typegoose/typegoose'
import { Date, Types } from 'mongoose'
import bcrypt from 'bcrypt'
import { Role } from './Role'

@modelOptions({
    schemaOptions: {
        timestamps: true,
        versionKey: false
    }
})
export class User {
    public _id?: Types.ObjectId

    @prop({ type: String, required: true, trim: true })
    username: string

    @prop({ type: String, required: true, unique: true, trim: true })
    email: string

    @prop({ type: String, required: true, trim: true })
    password: string

    public confirm_password: string

    @prop({ ref: () => Role, required: true })
    roles: Ref<Role>[]

    @prop({ type: String, trim: true })
    operation_token: string

    @prop({ type: Boolean, default: false })
    confirmed: boolean

    public createdAt?: Date

    public updatedAt?: Date

    public static async encryptPassword(this: ReturnModelType<typeof User>, password: string) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    public static async comparePassword(this: ReturnModelType<typeof User>,  recivedPassword: string, password: string) {
        return await bcrypt.compare(recivedPassword, password)
    }
}

export const UserModel = getModelForClass(User)