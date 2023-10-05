import { gql } from '@apollo/client'

// Queries
export const USER_QUERIES = {
    get: gql`
        query {
            getUsers{
                _id
                username
                email
                roles {
                    _id
                    name
                }
            }
        }
    `,
    getOne: gql`
        query ($idUser: ID!){
            getOneUser (idUser: $idUser){
                _id
                username
                email
                roles {
                    _id
                    name
                }
            }
        }
    `
}

// Mutations
const create_params = {
    types: '$username: String!, $email: String!, $password: String!, $confirmPassword: String!',
    params: 'username: $username, email: $email, password: $password, confirm_password: $confirmPassword'
}

const signin_params = {
    types: '$email: String!, $password: String!',
    params: 'email: $email, password: $password'
}

const update_params = {
    types: '$idUser: ID!, $username: String, $email: String, $password: String, $roles: [RoleInput]',
    params: 'idUser: $idUser, username: $username, email: $email, password: $password, roles: $roles'
}

const form_reset_params = {
    types: '$code: String!, $password: String!, $confirmPassword: String!',
    params: 'code: $code, password: $password, confirm_password: $confirmPassword'
}

export const USER_MUTATIONS = {
    update: gql`
        mutation (${update_params.types}) {
            putUser(${update_params.params}) {
                _id
                username
                email
                roles {
                    _id
                    name
                }
            }
        }
    `,
    delete: gql`
        mutation ($idUser: ID!) {
            deleteUser(idUser: $idUser) {
                _id
                username
                email
                roles {
                    _id
                    name
                }
            }
        }
    `,
    signUp: gql`
        mutation (${create_params.types}) {
            signUp(${create_params.params})
        }
    `,
    signIn: gql`
        mutation (${signin_params.types}) {
            signIn(${signin_params.params})
        }
    `,
    resetPass: gql`
        mutation ($email: String!) {
            resetPass(email: $email) {
                _id
                username
                email
                roles {
                    _id
                    name
                }
            }
        }
    `,
    formResetPass: gql`
        mutation (${form_reset_params.types}) {
            formResetPass(${form_reset_params.params})
        }
    `
}