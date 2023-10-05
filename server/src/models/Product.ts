import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { Date, Types } from 'mongoose'

@modelOptions({
    schemaOptions: {
        timestamps: true,
        versionKey: false
    }
})
export class Product {
    public _id?: Types.ObjectId

    @prop({ type: String, required: true, unique: true, trim: true })
    public codigo: string

    @prop({ type: String, trim: true })
    public tipo?: string

    @prop({ type: String, trim: true })
    public descripcion?: string

    @prop({ type: Number, required: true })
    public precio_costo: number

    @prop({ type: Number, required: true })
    public precio_venta: number

    @prop({ type: Number, default: 0 })
    public cantidad?: number

    public createdAt?: Date

    public updatedAt?: Date
}

export const ProductModel = getModelForClass(Product)