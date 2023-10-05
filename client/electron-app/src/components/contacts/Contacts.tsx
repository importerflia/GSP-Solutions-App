import { useQuery } from "@apollo/client"
import { Fragment, useState, useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import Contact from "./Contact"
import { FaPlusCircle } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { AuthContext } from "../../context/authContext"
import { CONTACT_QUERIES } from "../../graphql/Contact"
import { massiveData } from "../../lib/functions"

const Contacts = () => {
    const { type } = useParams()
    const context = useContext(AuthContext)
    const { loading, error, data, refetch } = useQuery(CONTACT_QUERIES.get)
    const [contacts, setContacts] = useState([])
    const [dataFile, setFile] = useState({file: undefined, element: undefined})

    const navigate = useNavigate()

    const reRender = () => {
        refetch()
        if (data) setContacts(data.getContacts)
    }

    const handleFileChange = (e) => {
        setFile({file: e.target.files[0], element: e.target})
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
            if(messageExtensions.code.includes('TOKEN')) navigate('/signin')
        }
    }

    useEffect(() => {
        createMessage(error)
        reRender()
    }, [data, error])

    if (loading) return <LoadingSpinner/>

    return (
        <Fragment>
            <h2>{ type === 'C' ? 'Clientes' : 'Proveedores' }</h2>

            {   context.isModerator
                ? <Fragment>
                    <Link to={ `/contacts/${type}/new` } className="btn btn-verde nvo-cliente"> 
                        <i><FaPlusCircle/></i>
                        Nuevo { type === 'C' ? 'Cliente' : 'Proveedor' }
                    </Link>

                    <form onSubmit={ (e) => massiveData(e, dataFile, 'CT', 'contactos', reRender, setFile) }>
                        <div className="campo contenedor-file">
                            <input type="file" name="file" id="file" className="file" required onChange={ handleFileChange }/>
                            <button type='submit' className="btn btn-verde nvo-cliente btn-file">Enviar</button>
                        </div>
                    </form>
                </Fragment>
                : null
            }

            <ul className="listado-clientes">
                {contacts ? contacts.map(contact => {
                    if (contact.tipo.includes(type)){
                        return <Contact contact={contact} key={contact._id} reRender={reRender} type={type}/>
                    }
                }): ''}
            </ul>
        </Fragment>
    )
}

export default Contacts