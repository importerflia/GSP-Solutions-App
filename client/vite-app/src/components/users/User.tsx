import { useMutation } from "@apollo/client"
import { useEffect, useContext } from "react"
import { FaPenAlt, FaTimes } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { USER_MUTATIONS } from "../../graphql/User"
import { AuthContext } from "../../context/authContext"


const User = ({ user, reRender }) => {
    const [deleteUser, { loading, error, data }] = useMutation(USER_MUTATIONS.delete)
    const { _id, username, email } = user
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const handleClick = (idUser) => {
        Swal.fire({
            title: 'Esta seguro?',
            text: "No podra revertir los cambios!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser({
                    variables: {
                        idUser: idUser
                    }
                })
                if (!error) {
                    Swal.fire(
                        'Usuario Eliminado!',
                        `Se elimino el Usuario con el email: ${email}.`,
                        'success'
                    )
                }
                reRender()
            }
        })
    }

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
    }, [error, data])

    if (loading) return <LoadingSpinner />

    return (
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">{username}</p>
                <p className="empresa">Correo: {email}</p>
            </div>

            {user._id !== context.user.userId
                ? <div className="acciones">
                    <Link to={`/users/edit/${_id}`} className="btn btn-azul">
                        <i><FaPenAlt /></i>
                        Editar Usuario
                    </Link>

                    <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => handleClick(_id)}>
                        <i><FaTimes /></i>
                        Eliminar Usuario
                    </button>
                </div>
                : null
            }
        </li>
    )
}

export default User