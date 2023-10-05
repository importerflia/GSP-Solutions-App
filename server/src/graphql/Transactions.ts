import gql from "graphql-tag"
import { Types } from "mongoose"
import { Transaction } from "../models/Transaction"
import * as transactionCtrl from '../controllers/transactionsCtrl'
import { checkIsValidToken } from "../middlewares/verifications"

export const typeDefs = gql`
    
    type Pedido {
        _id: ID
        producto: Product
        cantidad: Int
    }

    input PedidoInput {
        producto: ID!
        cantidad: Int!
    }
    
    type Transaction {
        _id: ID
        codigo: String
        contacto: Contact
        pedido: [Pedido]
        plazo: Int
        cantidad_pagada: Float
        total: Float
        tipo: String
        createdAt: Date
        updatedAt: Date
    }

    extend type Query {
        getTransactions: [Transaction]
        getOneTransaction(idTransaction: ID!): Transaction
        getTransactionsByDateRange(
            dateStart: String!
            dateEnd: String!
        ): [Transaction]
    }

    extend type Mutation {
        postTransaction(
            contacto: ID!
            pedido: [PedidoInput]
            plazo: Int
            cantidad_pagada: Float
            total: Float
            tipo: String!
        ): Transaction
        putTransaction(
            idTransaction: ID!
            pedido: [PedidoInput]
            plazo: Int
            total: Float
            tipo: String!
        ): Transaction
        deleteTransaction(idTransaction: ID!): Transaction
    }
`

export const resolvers = {
    Query: {
        getTransactions: async (_parent: any, _args: any, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await transactionCtrl.getTransactions()
            return response
        },
        getOneTransaction: async (_parent: any, {idTransaction}: {idTransaction: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await transactionCtrl.getOneTransaction(idTransaction)
            return response
        },
        getTransactionsByDateRange: async (_parent: any, { dateStart, dateEnd }: { dateStart: string, dateEnd: string }, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await transactionCtrl.getTransactionsByDateRange({ dateStart, dateEnd })
            return response
        }
    },
    Mutation: {
        postTransaction: async (_parent: any, args: Transaction, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await transactionCtrl.createOneTransaction(args)
            return response
        },
        putTransaction: async (_parent: any, args: Transaction, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await transactionCtrl.updateOneTransaction(args)
            return response
        },
        deleteTransaction: async (_parent: any, {idTransaction}: {idTransaction: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await transactionCtrl.deleteOneTransaction(idTransaction)
            return response
        }
    }
}