import gql from "graphql-tag"
import { Types } from "mongoose"
import { Contact } from "../models/Contact"
import * as contactCtrl from '../controllers/contactsCtrl'
import { checkIsValidToken } from "../middlewares/verifications"

export const typeDefs = gql`
    type Contact {
        _id: ID
        documento: String
        nombre: String
        email: String
        telefono: String
        direccion: String
        credito: Float
        deuda: Float
        tipo: String
        createdAt: Date
        updatedAt: Date
    }

    extend type Query {
        getContacts: [Contact]
        getOneContact(idContact: ID!): Contact
    }

    extend type Mutation {
        postContact(
            documento: String!
            nombre: String!
            email: String!
            telefono: String
            direccion: String
            credito: Float
            deuda: Float
            tipo: String!
        ): Contact
        putContact(
            idContact: ID!
            documento: String
            nombre: String
            email: String
            telefono: String
            direccion: String
            tipo: String
        ): Contact
        deleteContact(idContact: ID!): Contact
    }
`

export const resolvers = {
    Query: {
        getContacts: async (_parent: any, _args: any, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await contactCtrl.getContacts()
            return response
        },
        getOneContact: async (_parent: any, {idContact}: {idContact: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await contactCtrl.getOneContact(idContact)
            return response
        }
    },
    Mutation: {
        postContact: async (_parent: any, args: Contact, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await contactCtrl.createOneContact(args)
            return response
        },
        putContact: async (_parent: any, args: Contact, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await contactCtrl.updateOneContact(args)
            return response
        },
        deleteContact: async (_parent: any, {idContact}: {idContact: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await contactCtrl.deleteOneContact(idContact)
            return response
        }
    }
}