import { useEffect, Fragment } from "react"
import { useQuery } from "@apollo/client"
import Swal from "sweetalert2"
import Select from "react-select"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { CONTACT_QUERIES } from "../../graphql/Contact"

const FormSearchContact = (props) => {
    const { type, contact } = props
    const handleContactChange = props.hasOwnProperty('handleContactChange') ? props.handleContactChange : undefined
    const update = props.hasOwnProperty('update') ? props.update : false
    const contactType = type === 'V' ? 'C' : 'P'
    const contactLabelType = type === 'V' ? 'Cliente' : 'Proveedor'

    const { loading, error, data } = useQuery(CONTACT_QUERIES.get)
    const navigate = useNavigate()

    let contactOptions = []

    if (data && data.getContacts) {
        data.getContacts.forEach((contact) => {
            if (contact.tipo.includes(contactType)){
                contactOptions.push({
                    value: contact._id,
                    label: `${contact.nombre}, ${contact.documento}`
                })
            }
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
            <form style={ update ? { display: "none" } : {}}>
                <legend>Selecciona un { contactLabelType }</legend>
                <div style={{ padding: ".5rem 2rem", marginBottom: "2rem" }}>
                    <Select 
                        options={ contactOptions }
                        isClearable
                        backspaceRemovesValue
                        required={ !update ? true : false }
                        placeholder='Seleccione un contacto'
                        onChange={ (e) => handleContactChange(e, data) }
                    />
                </div>
            </form>

            {   
                contact 
                ? <div className="ficha-cliente">
                    <h3>Datos de { contactLabelType }</h3>
                    <p>Nombre: { contact.nombre }</p>
                    <p>Documento: { contact.documento }</p>
                    <p>Correo: { contact.email }</p>
                </div>
                : ''
            }
        </Fragment>
    )
}

export default FormSearchContact