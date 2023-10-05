import { Types } from "mongoose"
import { GraphQLError } from "graphql"
import { UserModel, User } from "../models/User"
import { checkConfirmPassword, checkDuplicateUserEmail, checkExistKey, checkUserIsConfirmed } from "../middlewares/verifications"
import { createJWTToken } from "../middlewares/auth"
import { createOperationToken, foundUserRoles } from "../lib/functions"
import { resetPassEmail, signUpEmail } from "../lib/email"
import { RequestHandler } from "express"

export const createOneUser = async (args: User) => {
    try {
        const user = new UserModel(args)
        user.confirm_password = args.confirm_password
        checkConfirmPassword(user.password, user.confirm_password)
        user.password = await UserModel.encryptPassword(user.password)
        await checkDuplicateUserEmail(args.email)
        const newUser = await user.save()
        return await newUser.populate('roles')

    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/C1US'
            }
        })
    }
}

export const getUsers = async () => {
    try {
        const users = await UserModel.find({}).populate('roles')
        return users

    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/GUSS'
            }
        })
    }
}

export const getOneUser = async (idUser: Types.ObjectId) => {
    try {
        const user = await checkExistKey(UserModel, '_id', idUser, 'Usuario', { populate: 'roles' })
        return user

    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/G1US'
            },
        })
    }
}

export const updateOneUser = async (args: { [key: string]: any }) => {
    try {
        const user = await checkExistKey(UserModel, '_id', args.idUser, 'Usuario') as User
        if (args.email) await checkDuplicateUserEmail(args.email, user._id!.toString())
        const roleIds = await foundUserRoles(args.roles)
        args.roles = roleIds.map((role) => role._id)
        const updatedUser = await UserModel.findOneAndUpdate({ _id: args.idUser }, args, { new: true }).populate('roles')
        return updatedUser

    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/U1US'
            },
        })
    }
}

export const deleteOneUser = async (idUser: Types.ObjectId) => {
    try {
        await checkExistKey(UserModel, '_id', idUser, 'Usuario')
        const deletedUser = await UserModel.findOneAndDelete({ _id: idUser }).populate('roles')
        return deletedUser

    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/D1US'
            },
        })
    }
}

export const signUpUser = async (args: { [key: string]: any }) => {
    try {
        const roleIds = await foundUserRoles(args.roles)
        args.roles = roleIds.map((role) => role._id)
        const user = new UserModel(args)
        user.confirm_password = args.confirm_password
        user.operation_token = createOperationToken()
        await signUpEmail({
            name: user.username,
            email: user.email,
            operationToken: user.operation_token
        })
        const newUser = await createOneUser(user) as User
        const token = createJWTToken(newUser)
        return token

    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/SUUS'
            },
        })
    }
}

export const signInUser = async (args: User) => {
    try {
        const populate = 'roles'
        const user = await checkExistKey(UserModel, 'email', args.email, 'Usuario', { populate }) as User
        await checkUserIsConfirmed(user)
        const matchPassword = await UserModel.comparePassword(args.password, user!.password)
        if (!matchPassword) {
            throw new GraphQLError('Contraseña incorrecta, por favor intente de nuevo.', {
                extensions: {
                    code: 'WRONG_PASSWORD',
                    pathName: 'C/SIUS'
                }
            })
        }

        const token = createJWTToken(user)
        return token

    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/SIUS'
            },
        })
    }
}

export const confirmUser: RequestHandler = async (req, res) => {
    const { operationToken } = req.params
    const user = await UserModel.findOne({ operation_token: operationToken })
    if (!user) {
        return res.render('email/confirmEmail', {
            page: 'Error al confirmar tu cuenta',
            message: 'Hubo un error al confirmar tu cuenta o ya fue confirmada anteriormente.',
            error: true
        })
    }
    await UserModel.updateOne({ operation_token: operationToken }, { operation_token: null, confirmed: true })
    return res.render('email/confirmEmail', {
        page: 'Cuenta Confirmada',
        message: 'La cuenta se confirmo correctamente.'
    })
}

export const resetPassUser = async (email: string) => {
    try {
        const user = await checkExistKey(UserModel, 'email', email, 'Usuario') as User
        await checkUserIsConfirmed(user)
        user.operation_token = createOperationToken()
        await resetPassEmail({
            name: user!.username,
            email: user!.email,
            operationToken: user!.operation_token
        })
        const newUser = await UserModel.findOneAndUpdate({ email }, { operation_token: user.operation_token }, { new: true })
        return newUser
    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/RPUS'
            },
        })
    }
}

export const restorePassword = async (args: { [key: string]: any }) => {
    try {
        const user = await UserModel.findOne({ operation_token: args.code })
        if (!user || !user.confirmed || !user.operation_token) {
            throw new GraphQLError('Codigo de verificacion invalido, por favor intentelo de nuevo.', {
                extensions: {
                    code: 'NOT_USER_FOUND',
                    pathName: 'UC/RSPS'
                }
            })
        }
        checkConfirmPassword(args.password, args.confirm_password)
        user.password = await UserModel.encryptPassword(args.password)
        await UserModel.updateOne({ operation_token: user.operation_token },
            {
                operation_token: null,
                password: user.password
            }
        )
        return 'Se restauro la contraseña satisfactoriamente'
    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/RPUS'
            },
        })
    }
}