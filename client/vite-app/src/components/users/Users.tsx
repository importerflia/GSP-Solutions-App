import { useQuery } from "@apollo/client"
import { Fragment, useState, useEffect } from "react"
import User from "./User"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { USER_QUERIES } from "../../graphql/User"

const Users = () => {
    const { loading, error, data, refetch } = useQuery(USER_QUERIES.get)
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    const reRender = () => {
        refetch()
        if (data) setUsers(data.getUsers)
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
        reRender()
        createMessage(error)
    }, [data, error])

    if (loading) return <LoadingSpinner/>

    return (
        <Fragment>
            <h2>Usuarios</h2>

            <ul className="listado-clientes">
                {users.map(user => {
                    return <User user={user} key={user._id} reRender={reRender}/>
                })}
            </ul>
        </Fragment>
    )
}

export default Users