import { GraphQLError } from "graphql"
import { RoleModel } from "../models/Role"
import { UserModel } from "../models/User"


export const createRoles = async () => {
    try {
        const count = await RoleModel.estimatedDocumentCount()

        if (count > 0) return

        await Promise.all([
            new RoleModel({ name: 'admin' }).save(),
            new RoleModel({ name: 'moderator' }).save(),
            new RoleModel({ name: 'user' }).save()
        ])
    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'L/CRRL'
            },
        })
    }
}

export const createAdmin = async () => {
    try {
        const count = await UserModel.estimatedDocumentCount()

        const roleObjs = await RoleModel.find({name: {$in: ['admin', 'moderator']}})
        const roleIds = roleObjs.map((role) => role._id)

        if (count > 0) return

        await new UserModel({
            username: 'admin',
            email: 'admin',
            password: await UserModel.encryptPassword('admin'),
            confirmed: true,
            operation_token: null,
            roles: roleIds
        }).save()

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'L/CRRL'
            },
        })
    }
}