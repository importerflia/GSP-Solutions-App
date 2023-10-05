import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose"
import { Date, Types } from "mongoose"
import { Transaction } from "./Transaction"

@modelOptions({
    schemaOptions: {
        timestamps: true,
        versionKey: false
    }
})
export class Payment {
    _id?: Types.ObjectId

    @prop({ type: String, required: true, unique: true, trim: true })
    codigo: string

    @prop({ ref: () => Transaction, required: true })
    transaccion: Ref<Transaction>

    @prop({ type: Number, required: true })
    total: number

    @prop({ type: String, required: true, trim: true })
    tipo: string

    createdAt?: Date

    updatedAt?: Date
}

export const PaymentModel = getModelForClass(Payment)