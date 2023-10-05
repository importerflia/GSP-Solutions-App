import { Types } from "mongoose"
import { GraphQLError } from "graphql"
import { ContactModel, Contact } from "../models/Contact"
import { checkContactHasTransactions, checkDuplicateContactDocument, checkExistKey } from "../middlewares/verifications"
import { createRectificativeTransaction } from "../lib/functions"

export const createOneContact = async (args: Contact) => {
    try {
        await checkDuplicateContactDocument(args.documento, args.tipo)
        const contact = new ContactModel(args)
        if (contact.credito || contact.deuda){
            await createRectificativeTransaction(contact)
        }
        const newContact = await contact.save()
        return newContact

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'C/C1CT'
            }
        })
    }
}

export const getContacts = async () => {
    try {
        const contacts = await ContactModel.find({})
        return contacts

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

export const getOneContact = async (idContact: Types.ObjectId) => {
    try {
        const contact = await checkExistKey(ContactModel, '_id', idContact, 'Contacto')
        return contact

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

export const updateOneContact = async (args: {[key:string]: any}) => {
    try {
        const contact = await checkExistKey(ContactModel, '_id', args.idContact, 'Contacto') as Contact
        if (args.documento) await checkDuplicateContactDocument(args.documento, contact.tipo, contact._id!.toString())
        const updatedContact = await ContactModel.findOneAndUpdate({ _id: args.idContact }, args, { new: true })
        return updatedContact

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'C/U1CT'
            },
        })
    }
}

export const deleteOneContact = async (idContact: Types.ObjectId) => {
    try {
        await checkExistKey(ContactModel, '_id', idContact, 'Contacto')
        await checkContactHasTransactions(idContact)
        const deletedContact = await ContactModel.findOneAndDelete({ _id: idContact })
        return deletedContact

    } catch (error) {
        if (error instanceof GraphQLError){
            throw error
        }
        console.log(error)
        throw new GraphQLError('Ha ocurrido un error', {
            extensions: {
              code: 'UNKNOW_ERROR',
              pathName: 'C/D1CT'
            },
        })
    }

}