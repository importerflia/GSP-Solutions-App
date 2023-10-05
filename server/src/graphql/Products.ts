import gql from "graphql-tag"
import { Types } from "mongoose"
import { Product } from "../models/Product"
import * as productCtrl from '../controllers/productsCtrl'
import { checkIsValidToken } from "../middlewares/verifications"

export const typeDefs = gql`
    type Product {
        _id: ID
        codigo: String
        tipo: String
        descripcion: String
        precio_costo: Float
        precio_venta: Float
        cantidad: Int
        createdAt: Date
        updatedAt: Date
    }

    type File {
        id: ID!
        path: String!
        filename: String!
        mimetype: String!
        encoding: String!
    }

    extend type Query {
        getProducts: [Product]
        getOneProduct(idProduct: ID!): Product
    }

    extend type Mutation {
        postProduct(
            codigo: String!
            tipo: String
            descripcion: String
            precio_costo: Float!
            precio_venta: Float!
            cantidad: Int
        ): Product
        putProduct(
            idProduct: ID!
            codigo: String
            tipo: String
            descripcion: String
            precio_costo: Float
            precio_venta: Float
            cantidad: Int
        ): Product
        deleteProduct(idProduct: ID!): Product
    }
`

export const resolvers = {
    Query: {
        getProducts: async (_parent: any, _args: any, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await productCtrl.getProducts()
            return response
        },
        getOneProduct: async (_parent: any, {idProduct}: {idProduct: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await productCtrl.getOneProduct(idProduct)
            return response
        }
    },
    Mutation: {
        postProduct: async (_parent: any, args: Product, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await productCtrl.createOneProduct(args)
            return response
        },
        putProduct: async (_parent: any, args: Product, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await productCtrl.updateOneProduct(args)
            return response
        },
        deleteProduct: async (_parent: any, {idProduct}: {idProduct: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await productCtrl.deleteOneProduct(idProduct)
            return response
        }
    }
}