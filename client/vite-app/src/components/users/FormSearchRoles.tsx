import { useEffect, Fragment, useState } from "react"
import { useQuery } from "@apollo/client"
import Swal from "sweetalert2"
import Select from "react-select"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { ROLE_QUERIES } from "../../graphql/Role"

const FormSearchRoles = (props) => {
    const { user } = props
    const handleRoleChange = props.hasOwnProperty('handleRoleChange') ? props.handleRoleChange : undefined
    const update = props.hasOwnProperty('update') ? props.update : false

    const { loading, error, data } = useQuery(ROLE_QUERIES.get)
    const navigate = useNavigate()

    let roleOptions = []

    if (data && data.getRoles) {
        data.getRoles.forEach((role) => {
            roleOptions.push({
                value: role._id,
                label: role.name
            })
        })
    }

    // Creando el mensaje de SweetAlert2
    const createMessage = (messageError) => {
        if (messageError) {
            const messageExtensions = messageError.graphQLErrors[0].extensions
            Swal.fire(
                messageError.message,
                messageExtensions.code,
                'error'
            )
            if (messageExtensions.code.includes('TOKEN')) navigate('/signin')
        }
    }

    useEffect(() => {
      createMessage(error)
    }, [error])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <legend>Selecciona los roles</legend>
            <div style={{ padding: ".5rem 2rem", marginBottom: "2rem" }}>
                <Select 
                    options={ roleOptions }
                    isClearable
                    backspaceRemovesValue
                    required
                    isMulti
                    placeholder='Seleccione un rol'
                    onChange={ (e) => handleRoleChange(e, data) }
                />
            </div>
        </Fragment>
    )
}

export default FormSearchRoles