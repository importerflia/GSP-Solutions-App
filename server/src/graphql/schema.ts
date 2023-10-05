import gql from "graphql-tag"
import * as Product from "./Products"
import * as Contact from "./Contacts"
import * as User from "./Users"
import * as Transaction from "./Transactions"
import * as Payment from "./Payments"
import * as Auth from "./Auth"
import * as Roles from "./Roles"

const rootTypeDefs = gql`
    scalar Date

    type Query {
        _: String
    }

    type Mutation {
        _: String
    }
`

export const resolvers = [
    Product.resolvers, Contact.resolvers, User.resolvers, Transaction.resolvers, Payment.resolvers, Auth.resolvers, Roles.resolvers]

export const typeDefs = [
    rootTypeDefs, Product.typeDefs, Contact.typeDefs, User.typeDefs, Transaction.typeDefs, Payment.typeDefs, Auth.typeDefs, Roles.typeDefs]