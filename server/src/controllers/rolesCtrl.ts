import { Types } from "mongoose"
import { GraphQLError } from "graphql"
import { RoleModel } from "../models/Role"
import { checkExistKey } from "../middlewares/verifications"

export const getRoles = async () => {
    try {
        const roles = await RoleModel.find({})
        return roles

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/GCTS'
            }
        })
    }
}

export const getOneRole = async (idRole: Types.ObjectId) => {
    try {
        const role = await checkExistKey(RoleModel, '_id', idRole, 'Roleo')
        return role

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'C/G1CT'
            },
        })
    }
}