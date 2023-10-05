import { Request, RequestHandler, Response } from 'express'
import multer from 'multer'
import shortid from 'shortid'
import { checkProductExcel, checkContactExcel, checkPaymentExcel } from '../middlewares/verifications'
import { Contact } from '../models/Contact'
import { Payment } from '../models/Payment'
import { Product } from '../models/Product'
import { createOneContact } from './contactsCtrl'
import { createOnePayment } from './paymentsCtrl'
import { createOneProduct } from './productsCtrl'

export const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, __dirname + '../../uploads/')
    },
    filename: (_req, file, cb) => {
        const extension = file.originalname.split('.').slice(-1)
        cb(null, `${shortid.generate()}.${extension[0]}`)
    }
})
    
export const fileFilter = (_req: any, file: any, cb: any) => {
    const extension = file.originalname.split('.').slice(-1)
    if ( extension[0].includes('xls') ) {
        cb(null, true)
    } else {
        cb(new Error('Formato No válido'))
    }
}

const processFileData = async (req: Request, res: Response) => {
    const type = req.params['type']
    if (type === 'PR') {
        const response = await checkProductExcel(req.file, res)
        if (response.apiError) return response.apiError
        for (let product of response.data!){
            for (const [key, value] of Object.entries(product)){
                if (value){
                    if (isNaN(value)){
                        product[key] = String(value)
                    }else{
                        try {
                            product[key] = parseInt(value)
                        } catch (error) {
                            product[key] = parseFloat(value)
                        }
                    }
                }
            }
            await createOneProduct(product as Product)
        }
    } else if (type === 'CT'){
        const response = await checkContactExcel(req.file, res)
        if (response.apiError) return response.apiError
        for (let contact of response.data!){
            for (const [key, value] of Object.entries(contact)){
                if (value){
                    if (isNaN(value)){
                        contact[key] = String(value)
                    }else{
                        try {
                            contact[key] = parseInt(value)
                        } catch (error) {
                            contact[key] = parseFloat(value)
                        }
                    }
                }
            }
            await createOneContact(contact as Contact)
        }
    } else if (type === 'PG'){
        const response = await checkPaymentExcel(req.file, res)
        if (response.apiError) return response.apiError
        for (let payment of response.data!){
            for (const [key, value] of Object.entries(payment)){
                if (value){
                    if (isNaN(value)){
                        payment[key] = String(value)
                    }else{
                        try {
                            payment[key] = parseInt(value)
                        } catch (error) {
                            payment[key] = parseFloat(value)
                        }
                    }
                }
            }
            await createOnePayment(payment as Payment)
        }
    }
} 

export const uploadFile: RequestHandler = async (req, res) => {
    const verError = await processFileData(req, res)
    if (verError) return verError
    res.json({message: 'Cargado satisfactoriamente'})
}