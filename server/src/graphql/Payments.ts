import gql from "graphql-tag"
import { Types } from "mongoose"
import { Payment } from "../models/Payment"
import * as paymentCtrl from '../controllers/paymentsCtrl'
import { checkIsValidToken } from "../middlewares/verifications"
// import { PubSub } from "graphql-subscriptions"

// const pubsub = new PubSub()

export const typeDefs = gql`
    type Payment {
        _id: ID
        codigo: String
        transaccion: Transaction
        total: Float
        tipo: String
        createdAt: Date
        updatedAt: Date
    }

    extend type Query {
        getPayments: [Payment]
        getOnePayment(idPayment: ID!): Payment
    }

    extend type Mutation {
        postPayment(
            transaccion: ID!
            total: Float!
        ): Payment
        putPayment(
            idPayment: ID!
            total: Float
            tipo: String!
        ): Payment
        deletePayment(idPayment: ID!): Payment
    }
`

export const resolvers = {
    Query: {
        getPayments: async (_parent: any, _args: any, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await paymentCtrl.getPayments()
            return response
        },
        getOnePayment: async (_parent: any, {idPayment}: {idPayment: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await paymentCtrl.getOnePayment(idPayment)
            return response
        }
    },
    Mutation: {
        postPayment: async (_parent: any, args: Payment, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await paymentCtrl.createOnePayment(args)
            return response
        },
        putPayment: async (_parent: any, args: Payment, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await paymentCtrl.updateOnePayment(args)
            return response
        },
        deletePayment: async (_parent: any, {idPayment}: {idPayment: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await paymentCtrl.deleteOnePayment(idPayment)
            return response
        }
    }
}