import { Transaction, TransactionModel } from '../models/Transaction'
import { Contact, ContactModel } from '../models/Contact'
import { ProductModel } from '../models/Product'
import { Payment, PaymentModel } from '../models/Payment'
import { checkExistKey, checkPaymentAmount, checkQuantityProductsTransaction, checkTransactionHasPayments } from '../middlewares/verifications'
import { GraphQLError } from 'graphql'
import { RoleModel } from '../models/Role'

export const createCode = async (data: Transaction | Payment) => {
  const dataCode =
    data.tipo.includes('T')
      ? await TransactionModel.find({}).select({ codigo: 1, _id: 0 })
      : await PaymentModel.find({}).select({ codigo: 1, _id: 0 })
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789'
  const now = new Date()
  const lastCodes = []
  let newIdCode = ''
  let codigo = ''
  let char = 0

  for (let i = 0; i < dataCode.length; i++) {
    lastCodes.push(dataCode[i].codigo)
  }

  for (let i = 1; i <= 4; i++) {
    do {
      char = Math.floor(Math.random() * str.length - 1)
    } while (char < 0 || char > 35)
    newIdCode += str.charAt(char)
  }

  codigo = `${data.tipo}/${now.getFullYear()}/${
    now.getMonth() + 1
  }/${now.getDate()}/${newIdCode}`

  if (lastCodes.length > 0 && lastCodes.includes(codigo)) {
    codigo = await createCode(data)
    return codigo
  }

  return codigo
}

export const createRelationsTransaction = async (transaccion: Transaction) => {
  try {

    if (transaccion.pedido) {
        await checkQuantityProductsTransaction(transaccion)
    }

    if (transaccion.tipo.includes('V') && transaccion.plazo! > 0) {
        await updateDebtCredit(transaccion as Transaction, { new: true })

    } else if (transaccion.tipo.includes('C') && transaccion.plazo! > 0) { 
        await updateDebtCredit(transaccion as Transaction, { credit: true, new: true })
    }

    await updateInventory(transaccion)

  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
        {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'F/UPDC'
            }
        }
    )
  }
}

export const createPaymentTransaction = async (newTransaction: Transaction) => {
  try {
    let paymentType = ''
  
    if (newTransaction.tipo.includes('V')) {
      paymentType = newTransaction.tipo.includes('R') ? 'PVR' : 'PV'
    } else if (newTransaction.tipo.indexOf('C')) {
      paymentType = newTransaction.tipo.includes('R') ? 'PCR' : 'PC'
    }

    const data: Payment = {
      codigo: '',
      transaccion: newTransaction._id!,
      total: newTransaction.total!,
      tipo: paymentType
    }
    data.codigo = await createCode(data)
    const payment = new PaymentModel(data)
    await payment.save()

  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
      {
        extensions: {
          code: 'UNKNOW_ERROR',
          pathName: 'F/CPTR'
        }
      }
    )
  }
}

export const updateRelationsTransaction = async (newData: {[key:string]: any}, transaction: Transaction) => {
  try {

    if (newData.pedido){
      await checkQuantityProductsTransaction(newData, {update: true})
      await updateInventory(transaction, {update: true, newData})
      if (newData.total != transaction.total!) {
        if (transaction.tipo.includes('V')){
          await updateDebtCredit(newData as Transaction, {update: true})
        }else if (transaction.tipo.includes('C')){
          await updateDebtCredit(newData as Transaction, {update: true, credit: true})
        }
      }
    }

    return await updatePlazo(newData as Transaction, transaction)

  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
      {
        extensions: {
          code: 'UNKNOW_ERROR',
          pathName: 'F/UPRT'
        }
      }
    )
  }
}

export const deleteRelationsTransaction = async (transaction: Transaction) => {
  try {
    await updateInventory(transaction!)

    if (transaction!.plazo === 0) {
      await PaymentModel.deleteOne({ transaccion: transaction!._id })
    } else {
      const contact = await ContactModel.findOne({_id: transaction!.contacto})

      if (transaction!.tipo.includes('V')) {
        contact!.deuda! -= (transaction.total! - transaction!.cantidad_pagada!)
      } else if (transaction!.tipo.includes('C')) {
        contact!.credito! -= (transaction.total! - transaction!.cantidad_pagada!)
      }

      await PaymentModel.deleteMany({ transaccion: transaction!._id })

      await ContactModel.updateOne({ _id: contact!._id }, contact!)
    }
  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
      {
        extensions: {
          code: 'UNKNOW_ERROR',
          pathName: 'F/DRTR'
        }
      }
    )
  }
}

export const createRelationsPayment = async (payment: Payment) => {
  const transaction = await checkExistKey(TransactionModel, '_id', payment.transaccion, 'Transaccion') as Transaction
  await checkPaymentAmount(payment)

  transaction.cantidad_pagada! += payment.total
  if (transaction.tipo.includes('V')) {
    updateDebtCredit(payment as Payment)
  } else if (transaction.tipo.includes('C')) {
    updateDebtCredit(payment as Payment, {credit: true})
  }

  await TransactionModel.updateOne({ _id: transaction._id }, transaction)

}

export const updateRelationsPayment = async (newData: {[key:string]: any}, payment: Payment) => {
  const transaction = await checkExistKey(TransactionModel, '_id', payment.transaccion, 'Transaccion') as Transaction
  let diferenciaPago = 0

  if (newData.total < payment.total) {
    diferenciaPago = payment.total - newData.total
    transaction.cantidad_pagada = transaction.cantidad_pagada! - diferenciaPago

  } else if (newData.total > payment.total) {
    diferenciaPago = newData.total - payment.total
    transaction.cantidad_pagada = transaction.cantidad_pagada! + diferenciaPago

  }

  newData.transaccion = payment.transaccion

  if (transaction.tipo.includes('V')) {
    updateDebtCredit(newData as Payment, { update: true })
  } else if (transaction.tipo.includes('C')) {
    updateDebtCredit(newData as Payment, { update: true, credit: true })
  }

  await checkPaymentAmount(newData, { update: true })

  await TransactionModel.updateOne({ _id: transaction._id }, transaction)

}

export const deleteRelationsPayment = async (payment: Payment) => {
  const transaction = await checkExistKey(TransactionModel, '_id', payment.transaccion, 'Transaccion') as Transaction

  transaction.cantidad_pagada! -= payment.total
  if (transaction.tipo.includes('TV')) {
    await updateDebtCredit(payment as Payment, {update: true, notChange: true})
  } else if (transaction.tipo.includes('TC')) {
    await updateDebtCredit(payment as Payment, {update: true, notChange: true, credit: true})
  }

  await TransactionModel.updateOne({ _id: transaction._id }, transaction)
}

export const updatePlazo = async (newData: Transaction, transaction: Transaction) => {
  await checkTransactionHasPayments(transaction)

  if ((newData.plazo! > 0 && transaction.plazo === 0) || (newData.plazo! > 0 && transaction.plazo! > 0)) {
      if (transaction.tipo.includes('V')) {
        await updateDebtCredit(transaction as Transaction, {update: true})
      } else if (transaction.tipo.includes('C')) {
        await updateDebtCredit(transaction as Transaction, {update: true, credit: true})
      }
      if (transaction.plazo === 0){
        await PaymentModel.deleteOne({ transaccion: transaction._id })
        transaction.cantidad_pagada = 0
      }

  } else if (newData.plazo === 0 && transaction.plazo! > 0) {
      if (transaction.tipo.includes('TV')) {
        updateDebtCredit(transaction as Transaction, {update: true, notChange: true})
      } else if (transaction.tipo.includes('TC')) {
        updateDebtCredit(transaction as Transaction, {update: true, notChange: true, credit: true})
      }

    const data: Payment = {
      codigo: '',
      transaccion: transaction._id!,
      total: newData.hasOwnProperty('total') ? newData.total as number : transaction.total as number,
      tipo: transaction.tipo.includes('V') ? 'PV' : 'PC'
    }

    data.codigo = await createCode(data)
    const payment = new PaymentModel(data)
    await payment.save()
    transaction.cantidad_pagada = newData.hasOwnProperty('total') ? newData.total as number : transaction.total as number
  }

  return transaction.cantidad_pagada
}

export const updateInventory = async (transaction: Transaction, ...args: {[key:string]: any}[]) => {
  try {
    const kwargs = args[0] ? args[0] : {}
    const pedido = transaction.pedido
    for (let i = 0; i < pedido!.length; i++) {
        const product = await checkExistKey(ProductModel, '_id', pedido![i].producto, 'Producto')

        if (transaction.tipo.includes('V') && !kwargs.hasOwnProperty('update')) {
          product!.cantidad! -= pedido![i].cantidad
        } else if (transaction.tipo.includes('C') && !kwargs.hasOwnProperty('update')) {
          product!.cantidad! += pedido![i].cantidad
        }

        if (kwargs.hasOwnProperty('update') && kwargs.hasOwnProperty('newData') && pedido !== kwargs.newData.pedido) {
          if (transaction.tipo.includes('V')) {
            product!.cantidad! += pedido![i].cantidad
            await updateInventory(kwargs.newData)
          } else if (transaction.tipo.includes('C')) {
            product!.cantidad! -= pedido![i].cantidad
            await updateInventory(kwargs.newData)
          }
        }

        await ProductModel.findOneAndUpdate({ _id: pedido![i].producto }, product! , { new: true })
    }

  } catch (error) {
    if (error instanceof GraphQLError){
        throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
      {
        extensions: {
          code: 'UNKNOW_ERROR',
          pathName: 'F/UINV'
        }
      }
    )
  }
}

export const updateDebtCredit = async (model: {[key:string]: any}, ...args: Object[]) => {
    try {
        const kwargs = args[0] ? args[0] : {}
        const transactionId = model.transaccion ?? model.idTransaction ?? model._id
        const paymentId = transactionId === model.transaccion ? model._id ?? model.idPayment : null
        let contact: Contact
        let value = {}
        if(!kwargs.hasOwnProperty('new')){
          const transaction = await checkExistKey(TransactionModel, '_id', transactionId, 'Transaccion') as Transaction
          contact = await checkExistKey(ContactModel, '_id', transaction!.contacto, 'Contacto') as Contact
        }else{
          contact = await checkExistKey(ContactModel, '_id', model.contacto, 'Contacto') as Contact
        }
    
        if (model.tipo.includes('T') && !kwargs.hasOwnProperty('update')) {
            value = kwargs.hasOwnProperty('credito') 
            ? { credito: contact!.credito + model.total } : { deuda: contact!.deuda + model.total } 
    
        } else if (model.tipo.includes('P') && !kwargs.hasOwnProperty('update')) {
            value = kwargs.hasOwnProperty('credito') 
            ? { credito: contact!.credito! - model.total! } : { deuda: contact!.deuda! - model.total! }
        }

        if (kwargs.hasOwnProperty('update')) {
          const modelData = model.tipo.includes('T') 
          ? await checkExistKey(TransactionModel, '_id', transactionId, 'Transaccion')
          : await checkExistKey(PaymentModel, '_id', paymentId, 'Pago')

          let newValue = 0

          if (model.tipo.includes('T')){
            if(contact!.deuda! !== 0){
              newValue = kwargs.hasOwnProperty('credito') ? contact!.credito! - modelData!.total : contact!.deuda! - modelData!.total
            }

            value = kwargs.hasOwnProperty('credito') ? { credito: newValue + model.total! } : { deuda: newValue + model.total! }
            
            if (kwargs.hasOwnProperty('notChange')){
              value = kwargs.hasOwnProperty('credito') ? { credito: newValue } : { deuda: newValue }
            }
          } else if (model.tipo.includes('P')){
            newValue = kwargs.hasOwnProperty('credito') ? contact!.credito + modelData!.total : contact!.deuda + modelData!.total
            value = kwargs.hasOwnProperty('credito') ? { credito: newValue - model.total! } : { deuda: newValue - model.total! }
            
            if (kwargs.hasOwnProperty('notChange')){
              value = kwargs.hasOwnProperty('credito') ? { credito: newValue } : { deuda: newValue }
            }
          }
        }

        await ContactModel.updateOne({ _id: contact!._id }, value)
        
    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error',
            {
                extensions: {
                    code: 'UNKNOW_ERROR',
                    pathName: 'F/UPDC'
                }
            }
        )
    }
}

export const createRectificativeTransaction = async (newData: Contact) => {
  try {
    const transactionData: Transaction = {
      codigo: '',
      contacto: newData._id!,
      plazo: 5,
      total: newData.credito ? newData.credito : newData.deuda,
      tipo: newData.credito ? "TCR" : "TVR"
    }
    transactionData.codigo = await createCode(transactionData)

    const transaction = new TransactionModel(transactionData)
    await transaction.save()

  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
        {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'F/CRTR'
            }
        }
    )
  }
}

export const foundUserRoles = async (roles: {[key:string]: string}[]) => {
  if(roles){
    const rolesName = roles.map((role: {[key:string]: any}) => role.name)
    return await RoleModel.find({name: {$in: rolesName}})
  }else{
    return await RoleModel.find({name: 'user'})
  }
}

export const createOperationToken = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32)
}