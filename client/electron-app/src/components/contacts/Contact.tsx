import { useMutation } from "@apollo/client"
import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { FaPenAlt, FaTimes } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { CONTACT_MUTATIONS } from "../../graphql/Contact"
import { AuthContext } from "../../context/authContext"

const Contact = ({ contact, reRender, type }) => {
    const [deleteContact, { loading, error, data }] = useMutation(CONTACT_MUTATIONS.delete)
    const { _id, documento, nombre, email, telefono, direccion, credito, deuda, tipo } = contact
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const handleClick = (idContact) => {
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
                deleteContact({ variables: {
                    idContact: idContact
                }})
                if (!error){
                    Swal.fire(
                        'Contacto Eliminado!',
                        `Se elimino el contacto con el documento: ${documento}.`,
                        'success'
                    )
                }
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
            if(messageExtensions.code.includes('TOKEN')) navigate('/signin')
        }
    }

    useEffect(() => {
        reRender()
        createMessage(error)
    }, [error, data])

    if (loading) return <LoadingSpinner/>

    return(
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">{ nombre }</p>
                <p className="empresa">{ documento }</p>
                <p>Correo: { email }</p>
                { telefono ? <p>Telefono: { telefono }</p>: '' }
                { direccion ? <p>Direccion: { direccion }</p>: '' }
                { tipo === 'C' 
                ? <p className="precio">Deuda: { deuda.toFixed(2) }</p> 
                : tipo === 'P' 
                ? <p className="precio">Credito: { credito.toFixed(2) }</p>
                : ''}
                { tipo === 'C/P' ? <p className="precio">Deuda: { deuda.toFixed(2) }</p> : '' }
                { tipo === 'C/P' ? <p className="precio">Credito: { credito.toFixed(2) }</p> : '' }
            </div>
            {   context.isModerator
                ? <div className="acciones">
                    <Link to={ `/contacts/${type}/edit/${_id}` } className="btn btn-azul">
                        <i><FaPenAlt/></i>
                        { contact.tipo === 'C' ? 'Editar Cliente' : contact.tipo === 'P' ? 'Editar Proveedor' : 'Editar Cliente/Proveedor'}
                    </Link>

                    <button type="button" className="btn btn-rojo btn-eliminar" onClick={ () => handleClick(_id) }>
                        <i><FaTimes/></i>
                        { contact.tipo === 'C' ? 'Eliminar Cliente' : contact.tipo === 'P' ? 'Eliminar Proveedor' : 'Eliminar Cliente/Proveedor'}
                    </button>
                </div>
                : null
            }
        </li>
    )
}

export default Contact