import { gql } from '@apollo/client'

// Queries
export const PAYMENT_QUERIES = {
    get: gql`
        query {
            getPayments {
                _id
                codigo
                transaccion {
                    _id
                    codigo
                    cantidad_pagada
                    contacto {
                        _id
                        documento
                        nombre
                        email
                    }
                    total
                }
                total
                tipo
            }
        }
    `,
    getOne: gql`
        query ($idPayment: ID!){
            getOnePayment (idPayment: $idPayment){
                _id
                codigo
                transaccion {
                    _id
                    codigo
                    cantidad_pagada
                    contacto {
                        _id
                        documento
                        nombre
                        email
                    }
                    total
                }
                total
                tipo
            }
        }
    `
}

// Mutations
const create_params = {
    types: '$transaccion: ID!, $total: Float!',
    params: 'transaccion: $transaccion, total: $total'
}

const update_params = {
    types: '$idPayment: ID!, $tipo: String!, $total: Float',
    params: 'idPayment: $idPayment, tipo: $tipo, total: $total'
}

export const PAYMENT_MUTATIONS = {
    create: gql`
        mutation (${create_params.types}) {
            postPayment(${create_params.params}) {
                _id
                codigo
                transaccion {
                    _id
                    codigo
                    cantidad_pagada
                    contacto {
                        _id
                        documento
                        nombre
                        email
                    }
                    total
                }
                total
                tipo
            }
        }
    `,
    update: gql`
        mutation (${update_params.types}) {
            putPayment(${update_params.params}) {
                _id
                codigo
                transaccion {
                    _id
                    codigo
                    cantidad_pagada
                    contacto {
                        _id
                        documento
                        nombre
                        email
                    }
                    total
                }
                total
                tipo
            }
        }
    `,
    delete: gql`
        mutation ($idPayment: ID!) {
            deletePayment(idPayment: $idPayment) {
                _id
                codigo
                transaccion {
                    _id
                    codigo
                    cantidad_pagada
                    contacto {
                        _id
                        documento
                        nombre
                        email
                    }
                    total
                }
                total
                tipo
            }
        }
    `
}