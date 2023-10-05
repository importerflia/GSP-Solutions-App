import { GraphQLError } from "graphql"
import { Types } from "mongoose"
import { TransactionModel, Transaction } from "../models/Transaction"
import { checkExistKey, checkTransactionHasPayments, checkTransactionPaidAmount } from "../middlewares/verifications"
import { createCode, createPaymentTransaction, createRelationsTransaction, deleteRelationsTransaction, updateRelationsTransaction } from "../lib/functions"

export const createOneTransaction = async (args: Transaction) => {
  try {
    const transaction = new TransactionModel(args)
    transaction.codigo = await createCode(transaction)
    await createRelationsTransaction(transaction)

    if (transaction.plazo === 0) {
      await createPaymentTransaction(transaction)
      transaction.cantidad_pagada = transaction.total
    }

    const newTransaction = await transaction.save()
    return await newTransaction.populate(['contacto', 'pedido.producto'])

  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
      {
          extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'C/C1TR'
          }
      }
    )
  }
}

export const getTransactions = async () => {
    try {
        const transactions = await TransactionModel.find({}).populate('contacto').populate({path: 'pedido.producto', model: 'Product'})
        return transactions

    } catch (error) {
      if (error instanceof GraphQLError){
        throw error
      }
      console.log(error)
      throw new GraphQLError('Ha ocurrido un error',
        {
          extensions: {
            code: 'UNKNOW_ERROR',
            pathName: 'C/GTRS'
          }
        }
      )
    }
}

export const getOneTransaction = async (idTransaction: Types.ObjectId) => {
    try {
      const populate = ['contacto', {path: 'pedido', populate: {path: 'producto', model:'Product'}}]
      const transaction = await checkExistKey(TransactionModel, '_id', idTransaction, 'Transaccion', { populate })
      return transaction

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error',
            {
                extensions: {
                    code: 'UNKNOW_ERROR',
                    pathName: 'C/G1TR'
                }
            }
        )
    }
}

export const getTransactionsByDateRange = async (args: {[key:string]: any}) => {
  const transactions = await TransactionModel.find({$and: [{createdAt: {$gte: args.dateStart, $lt: args.dateEnd}}]})
  .populate('contacto')
  .populate({path: 'pedido.producto', model: 'Product'})

  return transactions
}

export const updateOneTransaction = async (args: {[key:string]: any}) => {
    try {
      const populate = ['contacto', 'pedido.producto']
      const transaction = await checkExistKey(TransactionModel, '_id', args.idTransaction, 'Transaccion', { populate }) as Transaction
      await checkTransactionPaidAmount(args)
      const cantidadPagada = await updateRelationsTransaction(args, transaction!)
      args.cantidad_pagada = cantidadPagada
      const updatedTransaction = TransactionModel.findByIdAndUpdate({ _id: args.idTransaction }, args, { new: true }).populate(populate)
      return updatedTransaction

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error',
            {
                extensions: {
                    code: 'UNKNOW_ERROR',
                    pathName: 'C/G1TR'
                }
            }
        )
    }
}

export const deleteOneTransaction = async (idTransaction: Types.ObjectId) => {
    try {
      const populate = ['contacto', 'pedido.producto']
      const transaction = await checkExistKey(TransactionModel, '_id', idTransaction, 'Transaccion', { populate }) as Transaction
      await checkTransactionHasPayments(transaction)
      await deleteRelationsTransaction(transaction)
      const deletedTransaction = await TransactionModel.findOneAndDelete({ _id: idTransaction }).populate(populate)
      return deletedTransaction

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error',
            {
                extensions: {
                    code: 'UNKNOW_ERROR',
                    pathName: 'C/D1TR'
                }
            }
        )
    }
}