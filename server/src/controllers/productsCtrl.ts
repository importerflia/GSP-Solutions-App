import { Types } from "mongoose"
import { GraphQLError } from "graphql"
import { ProductModel, Product } from "../models/Product"
import { checkDuplicateProductCode, checkExistKey, checkProductHasTransactions } from "../middlewares/verifications"

export const createOneProduct = async (args: Product) => {
    try {
        const product = new ProductModel(args)
        await checkDuplicateProductCode(args.codigo)
        const newProduct = await product.save()
        return newProduct

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/C1PR'
            }
        })
    }
}

export const getProducts = async () => {
    try {
        const products = await ProductModel.find({})
        return products

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/GPRS'
            }
        })
    }
}

export const getOneProduct = async (idProduct: Types.ObjectId) => {
    try {
        const product = await checkExistKey(ProductModel, '_id', idProduct, 'Producto')
        return product

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'C/G1PR'
            },
        })
    }
}

export const updateOneProduct = async (args: {[key:string]: any}) => {
    try {
        const product = await checkExistKey(ProductModel, '_id', args.idProduct, 'Producto') as Product
        if (args.codigo) await checkDuplicateProductCode(args.codigo, product._id!.toString())
        const updatedProduct = await ProductModel.findOneAndUpdate({ _id: args.idProduct }, args, { new: true })
        return updatedProduct

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'C/U1PR'
            },
        })
    }
}

export const deleteOneProduct = async (idProduct: Types.ObjectId) => {
    try {
        await checkExistKey(ProductModel, '_id', idProduct, 'Producto')
        await checkProductHasTransactions(idProduct)
        const deletedProduct = await ProductModel.findOneAndDelete({ _id: idProduct })
        return deletedProduct

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'C/D1PR'
            },
        })
    }

}