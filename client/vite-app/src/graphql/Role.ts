import { gql } from '@apollo/client'

// Queries
export const ROLE_QUERIES = {
    get: gql`
        query {
            getRoles{
                _id
                name
            }
        }
    `,
    getOne: gql`
        query ($idRole: ID!){
            getOneRole (idRole: $idRole){
                _id
                name
            }
        }
    `
}