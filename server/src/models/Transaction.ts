import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'
import { Date, Types } from 'mongoose'
import { Contact } from './Contact'
import { Product } from './Product'

export class Pedido {
    @prop({ ref: () => Product })
    producto: Ref<Product>

    @prop({ type: Number })
    cantidad: number
}

@modelOptions({
    schemaOptions: {
        timestamps: true,
        versionKey: false
    }
})
export class Transaction {
    _id?: Types.ObjectId

    @prop({ type: String, required: true, unique: true, trim: true })
    public codigo: string

    @prop({ ref: () => Contact, required: true })
    public contacto: Ref<Contact>

    @prop({ type: () => [Pedido] })
    public pedido?: Pedido[]

    @prop({ type: Number, default: 0 })
    public plazo?: number

    @prop({ type: Number, default: 0.0 })
    public cantidad_pagada?: number

    @prop({ type: Number, default: 0.0 })
    public total?: number

    @prop({ type: String, required: true, trim: true })
    public tipo: string

    createdAt?: Date

    updatedAt?: Date

}

export const TransactionModel = getModelForClass(Transaction)