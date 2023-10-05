import { gql } from '@apollo/client'

// Queries
export const CONTACT_QUERIES = {
    get: gql`
        query {
            getContacts{
                _id
                documento
                nombre
                email
                telefono
                direccion
                credito
                deuda
                tipo
            }
        }
    `,
    getOne: gql`
        query ($idContact: ID!){
            getOneContact (idContact: $idContact){
                _id
                documento
                nombre
                email
                telefono
                direccion
                credito
                deuda
                tipo
            }
        }
    `
}

// Mutations
const create_params = {
    types: '$documento: String!, $nombre: String!, $email: String!, $tipo: String!, $telefono: String, $direccion: String, $credito: Float, $deuda: Float',
    params: 'documento: $documento, nombre: $nombre, email: $email, tipo: $tipo, telefono: $telefono, direccion: $direccion, credito: $credito, deuda: $deuda'
}

const update_params = {
    types: '$idContact: ID!, $documento: String, $nombre: String, $email: String, $telefono: String, $direccion: String, $tipo: String',
    params: 'idContact: $idContact, documento: $documento, nombre: $nombre, email: $email, telefono: $telefono, direccion: $direccion, tipo: $tipo'
}

export const CONTACT_MUTATIONS = {
    create: gql`
        mutation (${create_params.types}) {
            postContact(${create_params.params}) {
                _id
                documento
                nombre
                email
                telefono
                direccion
                credito
                deuda
                tipo
            }
        }
    `,
    update: gql`
        mutation (${update_params.types}) {
            putContact(${update_params.params}) {
                _id
                documento
                nombre
                email
                telefono
                direccion
                credito
                deuda
                tipo
            }
        }
    `,
    delete: gql`
        mutation ($idContact: ID!) {
            deleteContact(idContact: $idContact) {
                _id
                documento
                nombre
                email
                telefono
                direccion
                credito
                deuda
                tipo
            }
        }
    `
}