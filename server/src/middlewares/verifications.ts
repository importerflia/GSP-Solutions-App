import fs from 'fs'
import { Model, Types } from 'mongoose'
import { GraphQLError } from 'graphql'
import xlsxFile from 'read-excel-file/node'
import jwt from 'jsonwebtoken'
import { ProductModel } from '../models/Product'
import { ContactModel } from '../models/Contact'
import { User, UserModel } from '../models/User'
import { Role, RoleModel } from '../models/Role'
import { Transaction, TransactionModel } from '../models/Transaction'
import { PaymentModel } from '../models/Payment'
import { Response } from 'express'
import { SECRET } from '../config/env'

export const checkExistKey = async (
    model: Model<any>, field: string, value: any, fieldType: string, ...args: Array<any>): 
    Promise<{[key:string]:any} | null> => {
    
    try {
      const kwargs = args[0] ? args[0] : {}
      const isRes = kwargs.hasOwnProperty('res')
      const domain: {[key:string]: any} = {}
      domain[`${field}`] = value
      let key: {[key:string]:any} | null = null

      if (!('populate' in kwargs)){
        key = await model.findOne(domain)

      }else{
        key = await model.findOne(domain).populate(kwargs['populate'])

      }
    
      if (key == null && !isRes){
        throw new GraphQLError(`El registro de tipo ${fieldType} con el ${field}: ${value} no existe o fue eliminado.`, {
            extensions: {
                code: 'REGISTER_NOT_FOUND',
                pathName: 'MW/CEKY'
            }
        })
      }

      if (key == null){
        return kwargs.res.json({
          message: `El registro de tipo ${fieldType} con el ${field}: ${value} no existe o fue eliminado.`,
          apiCode: 'REGISTER_NOT_FOUND'
        })
      }

      return key

    } catch (error) {
      if (error instanceof GraphQLError){
        throw error
      }
      console.log(error)
      throw new GraphQLError('Ha ocurrido un error',
        {
          extensions: {
            code: 'UNKNOW_ERROR',
            pathName: 'MW/CEKY'
          }
        }
      )
    }
    
}

export const checkRolesExist = async (roles: Role[]) => {
  try {
    if (roles) {
      const roles = await RoleModel.find()
      for (let i = 0; i < roles.length; i++) {
        if (!roles.includes(roles[i])) {
          throw new GraphQLError(`El rol ${roles[i]} no existe`,
            {
              extensions: {
                code: 'ROLE_NOT_FOUND',
                pathName: 'MW/CRLE'
              }
            }
          )
        }
      }
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
          pathName: 'MW/CRLE'
        }
      }
    )
  }
}

export const checkDuplicateProductCode = async (code: string, idProduct?: String, args?: {[key:string]: any}) => {
  try {
    const kwargs = args ? args[0] : {}
    const productCode = await ProductModel.findOne({ codigo: code })
    const isRes = kwargs.hasOwnProperty('res')

    if (productCode !== null && idProduct !== productCode._id.toString() && !isRes) {
      throw new GraphQLError(`El producto ${code} ya existe`,
        {
          extensions: {
            code: 'PRODUCT_CODE_DUPLICATE',
            pathName: 'MW/CDPC'
          }
        }
      )
    }

    if (productCode !== null && idProduct !== productCode._id.toString()){
      return kwargs.res.json({message: `El producto ${code} ya existe`, apiCode: 'PRODUCT_CODE_DUPLICATE'})
    }

  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error', {
      extensions: {
        code: 'UNKNOW_ERROR',
        pathName: 'MW/CDPC'
      }
    })
  }
}

export const checkDuplicateContactDocument = async (document: string, contactType: string, idContact: String = '', args?: {[key:string]: any}) => {
  try {
    const kwargs = args ? args : {} 

    const contactDocument = await ContactModel.findOne({ documento: document })

    const errorContactType = contactType === 'C' ? 'cliente' : contactType === 'P' ? 'proveedor' : 'cliente/proveedor'

    const isRes = kwargs.hasOwnProperty('res')

    if (contactDocument !== null && idContact !== contactDocument._id.toString() && !isRes) {
      throw new GraphQLError(`El ${errorContactType} con el documento ${document} ya existe`,
        {
          extensions: {
            code: 'CONTACT_DOCUMENT_DUPLICATE',
            pathName: 'MW/CDCD'
          }
        }
      )
    }

    if (contactDocument !== null && idContact !== contactDocument._id.toString()){
      return kwargs.res.json({message: `El ${errorContactType} con el documento ${document} ya existe`, apiCode: 'CONTACT_DOCUMENT_DUPLICATE'})
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
          pathName: 'MW/CDCD'
        }
      }
    )
  }
}

export const checkDuplicateUserEmail = async (email: string, idUser: String = '') => {
  try {
    const userEmail = await UserModel.findOne({ email })

    if (userEmail !== null && idUser !== userEmail._id.toString()) {
      throw new GraphQLError(`Este email ${email} ya esta registrado`,
        {
          extensions: {
            code: 'USER_EMAIL_DUPLICATE',
            pathName: 'MW/CDEM'
          }
        }
      )
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
          pathName: 'MW/CDUE'
        }
      }
    )
  }
}

export const checkTransactionPaidAmount = async (newData: {[key:string]: any}) => {
  const transaction = await checkExistKey(TransactionModel, '_id', newData.idTransaction, 'Transaccion') as Transaction
  if (newData.total < transaction.cantidad_pagada!){
    throw new GraphQLError('El total de la transaccion es menor a la cantidad pagada', {
      extensions: {
        code: 'TOTAL_LESS_PAID',
        pathName: 'MW/CPDA'
      }
    })
  }
}

export const checkTransactionHasPayments = async (transaction: Transaction) => {
  try {
    const payments = await PaymentModel.find({ transaccion: transaction._id })
    if (payments.length > 0) {
      throw new GraphQLError(`La transaccion con el id: ${transaction._id} tiene pagos afiliados`, 
        {
          extensions: {
            code: 'TRANSACTION_WITH_PAYMENTS',
            pathName: 'MW/UPPL'
          }
        }
      )
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
          pathName: 'MW/UPPL'
        }
      }
    )
  }
}

export const checkPaymentAmount = async (newData: {[key:string]: any}, ...args: {[key:string]: any}[]) => {
  try {
    const kwargs = args[0] ? args[0] : {}
    const transaction = await checkExistKey(TransactionModel, '_id', newData.transaccion, 'Transaccion') as Transaction
    const maxTotal = transaction.total! - transaction.cantidad_pagada!
    const isUpdate = kwargs.hasOwnProperty('update')
    const isRes = kwargs.hasOwnProperty('res')

    if (!(newData.total <= maxTotal) && !isUpdate && !isRes|| !(newData.total <= transaction.total!) && !isRes) {
      throw new GraphQLError(`La cantidad a pagar no puede ser mayor a la cantidad adeudada, transaccion: ${transaction.codigo}`,
        {
          extensions: {
            code: 'PAYMENT_MORE_TOTAL',
            pathName: 'MW/CRPY'
          }
        }
      )
    }

    if (!(newData.total <= transaction.total! - transaction.cantidad_pagada!) && !kwargs.hasOwnProperty('update') 
      || !(newData.total <= transaction.total!)){
        return kwargs.res.json({
          message: `La cantidad a pagar no puede ser mayor a la cantidad adeudada, transaccion: ${transaction.codigo}`,
          apiCode: 'PAYMENT_MORE_TOTAL'
        }
      )
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
          pathName: 'MW/CRPY'
        }
      }
    )
  }
}

export const checkFieldFilled = async (data: {[key:string]: any}, res: Response) => {
  for (const [key, value] of Object.entries(data)){
    if(!value) {
      return res.json({message: `La celda ${key} es obligatoria`, apiCode: 'FILL_ERROR'})
    }
  }
}

export const checkFieldNumber = async (data: {[key:string]: any}, res: Response) => {
  for (const [key, value] of Object.entries(data)){
    if(value && isNaN(value)){
      return res.json({message: `La celda ${key} debe ser de tipo numerico`, apiCode: 'TYPE_ERROR'})
    }
  }
}

export const checkProductExcel = async (file: any, res: Response) => {
  const data = await xlsxFile(file.path)
  const products = []
  let verError
  for (let i in data){
    const index = parseInt(i)
    if (index === 0) {
      const data_header = ['codigo', 'tipo', 'descripcion', 'precio_costo', 'precio_venta', 'cantidad']
      if (data[index].toString() !== data_header.toString()){
        fs.unlinkSync(file.path)
        return {apiError: res.json({message: 'El archivo no tiene el formato correspondiente', apiCode: 'BAD_FILE'})}
      }
    } else {
      let product: {[key:string]: any} = {
        codigo: data[index][0],
        tipo: data[index][1] ? data[index][1] : '',
        descripcion: data[index][2] ? data[index][2] : '',
        precio_costo: data[index][3],
        precio_venta: data[index][4],
        cantidad: data[index][5] ? data[index][5] : 0,
      }
      const needData = {
        codigo: product.codigo ? String(product.codigo) : null, 
        precio_costo: product.precio_costo ? String(product.precio_costo) : null, 
        precio_venta: product.precio_venta ? String(product.precio_venta) : null
      }
      const typeData = {
        precio_costo: product.precio_costo ? String(product.precio_costo) : null, 
        precio_venta: product.precio_venta ? String(product.precio_venta) : null,
        cantidad: product.cantidad ? String(product.cantidad) : null
      }
      verError = await checkFieldFilled(needData, res)
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      verError = await checkFieldNumber(typeData, res)
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      verError = await checkDuplicateProductCode(String(product.codigo), '', [{res}])
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      products.push(product)
    }
  }
  if(!products.length) {
    fs.unlinkSync(file.path)
    return {apiError: res.json({message: 'El archivo no puede contener solo la cabecera', apiCode: 'BAD_FILE'})}
  }
  fs.unlinkSync(file.path)
  return {data: products}
}

export const checkContactExcel = async (file: any, res: Response) => {
  const data = await xlsxFile(file.path)
  const contacts = []
  let verError
  for (let i in data){
    const index = parseInt(i)
    if (index === 0) {
      const data_header = ['documento', 'nombre', 'email', 'telefono', 'direccion', 'credito', 'deuda', 'tipo']
      if (data[index].toString() !== data_header.toString()){
        fs.unlinkSync(file.path)
        return {apiError: res.json({message: 'El archivo no tiene el formato correspondiente', apiCode: 'BAD_FILE'})}
      }
    } else {
      let contact: {[key:string]: any} = {
        documento: data[index][0],
        nombre: data[index][1],
        email: data[index][2],
        telefono: data[index][3] ? data[index][3] : '',
        direccion: data[index][4] ? data[index][4] : '',
        credito: data[index][5] ? data[index][5] : 0.0,
        deuda: data[index][6] ? data[index][6] : 0.0,
        tipo: data[index][7]
      }
      const needData = {
        documento: contact.documento ? String(contact.documento) : null, 
        nombre: contact.nombre ? String(contact.nombre) : null, 
        email: contact.email ? String(contact.email) : null,
        tipo: contact.tipo ? String(contact.tipo) : null
      }
      const typeData = {
        credito: contact.credito ? String(contact.credito) : null, 
        deuda: contact.deuda ? String(contact.deuda) : null
      }
      verError = await checkFieldFilled(needData, res)
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      verError = await checkFieldNumber(typeData, res)
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      verError = await checkDuplicateContactDocument(String(contact.documento), String(contact.tipo), '', {res})
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      contacts.push(contact)
    }
  }
  if(!contacts.length) {
    fs.unlinkSync(file.path)
    return {apiError: res.json({message: 'El archivo no puede contener solo la cabecera', apiCode: 'BAD_FILE'})}
  }
  fs.unlinkSync(file.path)
  return {data: contacts}
}

export const checkPaymentExcel = async (file: any, res: Response) => {
  const data = await xlsxFile(file.path)
  const payments = []
  let verError
  for (let i in data){
    const index = parseInt(i)
    if (index === 0) {
      const data_header = ['transaccion', 'total']
      if (data[index].toString() !== data_header.toString()){
        fs.unlinkSync(file.path)
        return {apiError: res.json({message: 'El archivo no tiene el formato correspondiente', apiCode: 'BAD_FILE'})}
      }
    } else {
      let payment: {[key:string]: any} = {
        transaccion: data[index][0],
        total: data[index][1]
      }
      const needData = {
        transaccion: payment.transaccion ? String(payment.transaccion) : null, 
        total: payment.total ? String(payment.total) : null
      }
      const typeData = {
        total: payment.total ? String(payment.total) : null
      }
      verError = await checkFieldFilled(needData, res)
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      verError = await checkFieldNumber(typeData, res)
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      let transactionOrVerError = await checkExistKey(TransactionModel, 'codigo', String(payment.transaccion), 'Transaccion', {res})
      if (transactionOrVerError!.apiCode) {
        fs.unlinkSync(file.path)
        return {apiError: transactionOrVerError}
      }
      payment.transaccion = transactionOrVerError!._id
      verError = await checkPaymentAmount(payment, {res})
      if (verError) {
        fs.unlinkSync(file.path)
        return {apiError: verError}
      }
      payments.push(payment)
    }
  }
  if(!payments.length) {
    fs.unlinkSync(file.path)
    return {apiError: res.json({message: 'El archivo no puede contener solo la cabecera', apiCode: 'BAD_FILE'})}
  }
  fs.unlinkSync(file.path)
  return {data: payments}
}

export const checkQuantityProductsTransaction = async (transaction: {[key:string]: any}, ...args: {[key:string]: any}[]) => {
  const kwargs = args[0] ? args[0] : {} 
  try {
    if (transaction.pedido!.length){
      const oldTransaction = kwargs.hasOwnProperty('update') 
      ? await TransactionModel.findOne({_id: transaction.idTransaction},{'pedido._id': 0})
      : null

      for(let item of transaction.pedido){
        let comparisonValue
        const product = await checkExistKey(ProductModel, '_id', item.producto, 'Producto')
        const newProductId = item.producto
        if (oldTransaction){
          const oldProductIds = oldTransaction!.pedido!.map((oldItem) => {
              return oldItem.producto.toString()
          })
          if (oldProductIds.includes(newProductId)){
            const indexItem = oldProductIds.indexOf(newProductId)
            comparisonValue = product!.cantidad + oldTransaction!.pedido![indexItem].cantidad
          }else{
            comparisonValue = product!.cantidad
          }
        }else{
          comparisonValue = product!.cantidad
        }
        if (comparisonValue < item.cantidad){
          throw new GraphQLError(`La cantidad solicitada del producto ${product!.codigo} es mayor al stock actual.`, {
            extensions: {
              code: 'NO_STOCK',
              pathName: 'F/CRTR'
            }
          })
        }
      }
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
          pathName: 'MW/CPRIA'
        }
      }
    )
  }
}

export const checkProductHasTransactions = async (idProduct: Types.ObjectId) => {
  try {
    const transactions = await TransactionModel.find({'pedido.producto': idProduct})
    if(transactions.length > 0){
      throw new GraphQLError('El Producto que desea eliminar tiene transacciones relacionadas.', {
        extensions: {
          code: 'RELATION_TRANSACTIONS',
          pathName: 'MW/CPRHTR'
        }
      })
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
          pathName: 'MW/CPRHTR'
        }
      }
    )
  }
}

export const checkContactHasTransactions = async (idContact: Types.ObjectId) => {
  try {
    const transactions = await TransactionModel.find({contacto: idContact})
    if(transactions.length > 0){
      throw new GraphQLError('El Contacto que desea eliminar tiene transacciones relacionadas.', {
        extensions: {
          code: 'RELATION_TRANSACTIONS',
          pathName: 'MW/CCTHTR'
        }
      })
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
          pathName: 'MW/CCTHTR'
        }
      }
    )
  }
}

export const checkIsValidToken = async (token: string) => {
  try {
    if (!token){
      throw new GraphQLError('Sesion expirada, por favor inicie sesion nuevamente.', {
        extensions: {
          code: 'NO_TOKEN',
          pathName: 'V/CIVT'
        }
      })
    }
    const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload
    await checkExistKey(UserModel, '_id', decoded.userId, 'Usuario')
  } catch (error) {
    if (error instanceof GraphQLError){
      throw error
    }
    console.log(error)
    throw new GraphQLError('Ha ocurrido un error',
      {
        extensions: {
          code: 'UNKNOW_ERROR',
          pathName: 'MW/CPRHTR'
        }
      }
    )
  }
}

export const checkConfirmPassword = (password: string, confirm_password: string) => {
  if (password !== confirm_password){
    throw new GraphQLError('El campo "Confirmar Contraseña" no es igual al campo "Contraseña".', {
      extensions: {
        code: 'NOT_SAME_PASSWORD',
        pathName: 'MW/CCPS'
      }
    })
  }
}

export const checkUserIsConfirmed = async (user: User) => {  
  if(!user!.confirmed){
    throw new GraphQLError(`Usuario no confirmado, por favor revise su email: ${user!.email}, 
    y siga las instrucciones para confirmar su cuenta.`, {
      extensions: {
        code: 'USER_NOT_CONFIRMED',
        patName: 'MW/CUIC'
      }
    })
  }
}
