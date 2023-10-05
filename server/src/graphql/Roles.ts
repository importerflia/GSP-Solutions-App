import gql from "graphql-tag"
import { Types } from "mongoose"
import * as roleCtrl from '../controllers/rolesCtrl'
import { checkIsValidToken } from "../middlewares/verifications"

export const typeDefs = gql`
    type Role {
        _id: ID
        name: String
        createdAt: Date
        updatedAt: Date
    }

    extend type Query {
        getRoles: [Role]
        getOneRole(idRole: ID!): Role
    }
`

export const resolvers = {
    Query: {
        getRoles: async (_parent: any, _args: any, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await roleCtrl.getRoles()
            return response
        },
        getOneRole: async (_parent: any, {idRole}: {idRole: Types.ObjectId}, context: {[key:string]: any}) => {
            await checkIsValidToken(context.token)
            const response = await roleCtrl.getOneRole(idRole)
            return response
        }
    }
}