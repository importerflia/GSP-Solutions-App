import gql from "graphql-tag"
import { Types } from "mongoose"
import { User } from "../models/User"
import * as userCtrl from '../controllers/usersCtrl'
import { checkIsValidToken } from "../middlewares/verifications"

export const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        confirm_password: String
        roles: [Role]
        createdAt: Date
        updatedAt: Date
    }

    input RoleInput {
        name: String!
    }

    extend type Query {
        getUsers: [User]
        getOneUser(idUser: ID!): User
    }

    extend type Mutation {
        putUser(
            idUser: ID!
            username: String
            email: String
            password: String,
            roles: [RoleInput]
        ): User
        deleteUser(idUser: ID!): User
    }
`

export const resolvers = {
    Query: {
        getUsers: async (_parent: any, _args: any, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await userCtrl.getUsers()
            return response
        },
        getOneUser: async (_parent: any, {idUser}: {idUser: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await userCtrl.getOneUser(idUser)
            return response
        }
    },
    Mutation: {
        putUser: async (_parent: any, args: User, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await userCtrl.updateOneUser(args)
            return response
        },
        deleteUser: async (_parent: any, {idUser}: {idUser: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await userCtrl.deleteOneUser(idUser)
            return response
        }
    }
}