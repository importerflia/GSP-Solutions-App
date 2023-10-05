import { gql } from '@apollo/client'

// Queries
export const TRANSACTION_QUERIES = {
    get: gql`
        query {
            getTransactions{
                _id
                cantidad_pagada
                codigo
                contacto {
                    _id
                    nombre
                    documento
                    email
                    tipo
                }
                pedido {
                    _id
                    producto {
                        _id
                        codigo
                        precio_costo
                        precio_venta
                    }
                    cantidad
                }
                plazo
                tipo
                total
                createdAt
            }
        }
    `,
    getOne: gql`
        query ($idTransaction: ID!){
            getOneTransaction (idTransaction: $idTransaction){
                _id
                cantidad_pagada
                codigo
                contacto {
                    _id
                    nombre
                    documento
                    email
                    tipo
                }
                pedido {
                    _id
                    producto {
                        _id
                        codigo
                        precio_costo
                        precio_venta
                    }
                    cantidad
                }
                plazo
                tipo
                total
                createdAt
            }
        }
    `,
    getByDateRange: gql`
        query($dateStart: String!, $dateEnd: String!){
            getTransactionsByDateRange (dateStart: $dateStart, dateEnd: $dateEnd){
                _id
                cantidad_pagada
                codigo
                contacto {
                    _id
                    nombre
                    documento
                    email
                    tipo
                }
                pedido {
                    _id
                    producto {
                        _id
                        codigo
                        precio_costo
                        precio_venta
                    }
                    cantidad
                }
                plazo
                tipo
                total
                createdAt
                updatedAt
            }
        }
    `
}

// Mutations
const create_params = {
    types: '$contacto: ID!, $pedido: [PedidoInput], $plazo: Int, $cantidadPagada: Float, $tipo: String!, $total: Float',
    params: 'contacto: $contacto, pedido: $pedido, plazo: $plazo, cantidad_pagada: $cantidadPagada, tipo: $tipo, total: $total'
}

const update_params = {
    types: '$idTransaction: ID!, $pedido: [PedidoInput], $plazo: Int, $total: Float, $tipo: String!',
    params: 'idTransaction: $idTransaction, pedido: $pedido, plazo: $plazo, total: $total, tipo: $tipo'
}

export const TRANSACTION_MUTATIONS = {
    create: gql`
        mutation (${create_params.types}) {
            postTransaction(${create_params.params}) {
                _id
                cantidad_pagada
                codigo
                contacto {
                    _id
                    nombre
                    documento
                    email
                    tipo
                }
                pedido {
                    _id
                    producto {
                        _id
                        codigo
                        precio_costo
                        precio_venta
                    }
                    cantidad
                }
                plazo
                tipo
                total
            }
        }
    `,
    update: gql`
        mutation (${update_params.types}) {
            putTransaction(${update_params.params}) {
                _id
                cantidad_pagada
                codigo
                contacto {
                    _id
                    nombre
                    documento
                    email
                    tipo
                }
                pedido {
                    _id
                    producto {
                        _id
                        codigo
                        precio_costo
                        precio_venta
                    }
                    cantidad
                }
                plazo
                tipo
                total
            }
        }
    `,
    delete: gql`
        mutation ($idTransaction: ID!) {
            deleteTransaction(idTransaction: $idTransaction) {
                _id
                cantidad_pagada
                codigo
                contacto {
                    _id
                    nombre
                    documento
                    email
                }
                pedido {
                    _id
                    producto {
                        _id
                        codigo
                        precio_costo
                        precio_venta
                    }
                    cantidad
                }
                plazo
                tipo
                total
            }
        }
    `
}