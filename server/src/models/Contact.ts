import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { Date, Types } from 'mongoose'

@modelOptions({
    schemaOptions: {
        timestamps: true,
        versionKey: false
    }
})
export class Contact {
    public _id?: Types.ObjectId

    @prop({ type: String, required: true, unique: true, trim: true })
    public documento: string

    @prop({ type: String, required: true, trim: true })
    public nombre: string

    @prop({ type: String, required: true, trim: true })
    public email: string

    @prop({ type: String, trim: true })
    public telefono?: string

    @prop({ type: String, trim: true })
    public direccion?: string

    @prop({ type: Number, default: 0.0 })
    public credito?: number

    @prop({ type: Number, default: 0.0 })
    public deuda?: number

    @prop({ type: String, required: true, trim: true })
    public tipo: string

    public createdAt?: Date

    public updatedAt?: Date
}

export const ContactModel = getModelForClass(Contact)