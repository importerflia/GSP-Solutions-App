import { PaymentModel, Payment } from "../models/Payment"
import { checkExistKey } from "../middlewares/verifications"
import { GraphQLError } from "graphql"
import { Types } from "mongoose"
import { createCode, createRelationsPayment, deleteRelationsPayment, updateRelationsPayment } from "../lib/functions"
import { TransactionModel } from "../models/Transaction"

export const createOnePayment = async (args: Payment) => {
    try {
      const transaction = await checkExistKey(TransactionModel, '_id', args.transaccion, 'Transaccion')

      if (transaction!.tipo.includes('V')) {
        args.tipo = transaction!.tipo.includes('R') ? 'PVR' : 'PV'
      } else if (transaction!.tipo.indexOf('C')) {
        args.tipo = transaction!.tipo.includes('R') ? 'PCR' : 'PC'
      }

      const payment = new PaymentModel(args)
      payment.codigo = await createCode(args)
      await createRelationsPayment(payment)
      const newPayment = await payment.save()
      return await newPayment.populate('transaccion')

    } catch (error) {
      if (error instanceof GraphQLError){
        throw error
      }
      console.log(error)
      throw new GraphQLError('Ha ocurrido un error',
        {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/C1PY'
            }
        }
      )
    }
}

export const getPayments = async () => {
    try {
        const payments = await PaymentModel.find({}).populate({path: 'transaccion', populate: {path: 'contacto', model: 'Contact'}})
        return payments

    } catch (error) {
      if (error instanceof GraphQLError){
        throw error
      }
      console.log(error)
      throw new GraphQLError('Ha ocurrido un error',
        {
          extensions: {
            code: 'UNKNOW_ERROR',
            pathName: 'C/GPYS'
          }
        }
      )
    }
}

export const getOnePayment = async (idPayment: Types.ObjectId) => {
    try {
      const populate = {path: 'transaccion', populate: {path: 'contacto', model: 'Contact'}}
      const payment = await checkExistKey(PaymentModel, '_id', idPayment, 'Pago', { populate })
      return payment

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error',
            {
                extensions: {
                    code: 'UNKNOW_ERROR',
                    pathName: 'C/G1PY'
                }
            }
        )
    }
}

export const updateOnePayment = async (args: {[key:string]: any}) => {
    try {
      const populate = 'transaccion'
      const payment = await checkExistKey(PaymentModel, '_id', args.idPayment, 'Pago') as Payment
      await updateRelationsPayment(args, payment)
      const updatedPayment = PaymentModel.findByIdAndUpdate({ _id: args.idPayment }, args, { new: true }).populate(populate)
      return updatedPayment

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error',
            {
                extensions: {
                    code: 'UNKNOW_ERROR',
                    pathName: 'C/G1PY'
                }
            }
        )
    }
}

export const deleteOnePayment = async (idPayment: Types.ObjectId) => {
    try {
      const populate = {path: 'transaccion', populate: {path: 'contacto', model: 'Contact'}}
      const payment = await checkExistKey(PaymentModel, '_id', idPayment, 'Pago', { populate }) as Payment
      await deleteRelationsPayment(payment)
      const deletedPayment = await PaymentModel.findOneAndDelete({ _id: idPayment }).populate({path: 'transaccion', populate: {path: 'contacto', model: 'Contact'}})
      return deletedPayment

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error',
            {
                extensions: {
                    code: 'UNKNOW_ERROR',
                    pathName: 'C/D1PY'
                }
            }
        )
    }
}