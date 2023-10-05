import gql from "graphql-tag"
import { User } from "../models/User"
import * as userCtrl from '../controllers/usersCtrl'

export const typeDefs = gql`
    extend type Mutation {
        signUp(
            username: String!
            email: String!
            password: String!
            confirm_password: String!
        ): String
        signIn(
            email: String!
            password: String!
        ): String
        resetPass(
            email: String!
        ): User
        formResetPass(
            code: String!
            password: String!
            confirm_password: String!
        ): String
    }
`

export const resolvers = {
    Mutation: {
        signUp: async (_parent: any, args: User) => {
            const response = await userCtrl.signUpUser(args)
            return response
        },
        signIn: async (_parent: any, args: User) => {
            const response = await userCtrl.signInUser(args)
            return response
        },
        resetPass: async (_parent: any, {email}: {email: string}) => {
            const response = await userCtrl.resetPassUser(email)
            return response
        },
        formResetPass: async (_parent: any, args: {[key:string]: any}) => {
            const response = await userCtrl.restorePassword(args)
            return response
        }
    }
}