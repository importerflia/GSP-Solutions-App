import { gql } from '@apollo/client'

// Queries
export const PRODUCT_QUERIES = {
    get: gql`
        query {
            getProducts{
                _id
                codigo
                tipo
                descripcion
                precio_costo
                precio_venta
                cantidad
            }
        }
    `,
    getOne: gql`
        query ($idProduct: ID!){
            getOneProduct (idProduct: $idProduct){
                _id
                codigo
                tipo
                descripcion
                precio_costo
                precio_venta
                cantidad
            }
        }
    `
}

// Mutations
const create_params = {
    types: '$codigo: String!, $precioCosto: Float!, $precioVenta: Float!, $tipo: String, $descripcion: String, $cantidad: Int',
    params: 'codigo: $codigo, precio_costo: $precioCosto, precio_venta: $precioVenta, tipo: $tipo, descripcion: $descripcion, cantidad: $cantidad'
}

const update_params = {
    types: '$idProduct: ID!, $tipo: String, $descripcion: String, $precioCosto: Float, $precioVenta: Float, $cantidad: Int',
    params: 'idProduct: $idProduct, tipo: $tipo, descripcion: $descripcion, precio_costo: $precioCosto, precio_venta: $precioVenta, cantidad: $cantidad'
}

export const PRODUCT_MUTATIONS = {
    create: gql`
        mutation (${create_params.types}) {
            postProduct(${create_params.params}) {
                _id
                codigo
                tipo
                descripcion
                precio_costo
                precio_venta
                cantidad
            }
        }
    `,
    update: gql`
        mutation (${update_params.types}) {
            putProduct(${update_params.params}) {
                _id
                codigo
                tipo
                descripcion
                precio_costo
                precio_venta
                cantidad
            }
        }
    `,
    delete: gql`
        mutation ($idProduct: ID!) {
            deleteProduct(idProduct: $idProduct) {
                _id
                codigo
                tipo
                descripcion
                precio_costo
                precio_venta
                cantidad
            }
        }
    `,
    upload: gql`
        mutation ($file: Upload!) {
            uploadFile(file: $file)
        }
    `
}