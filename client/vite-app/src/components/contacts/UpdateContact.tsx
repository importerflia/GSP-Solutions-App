import { useMutation, useQuery } from "@apollo/client"
import { Fragment, useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { CONTACT_MUTATIONS, CONTACT_QUERIES } from "../../graphql/Contact"

const getOneContact = (idContact, navigate) => {
    const { error, data } = useQuery(CONTACT_QUERIES.getOne, {
        variables: { idContact }
    })

    if (error) {
        const extensions = error.graphQLErrors[0].extensions
        const code = extensions.code as string
        Swal.fire(
            error.message,
            code,
            'error'
        )
        if(code.includes('TOKEN')) navigate('/signin')
    }

    if (data && data.getOneContact) {
        return data.getOneContact
    }
}

const UpdateContact = () => {

    // Obteniendo id
    const { idContact, type } = useParams()

    // Creando objeto para navegar entre rutas
    const navigate = useNavigate()

    // Utilizando query
    const queryData = getOneContact(idContact, navigate)

    // Utilizando la mutacion
    const [putContact, { loading, error, data, reset }] = useMutation(CONTACT_MUTATIONS.update)

    const [contact, setContact] = useState({
        _id: '',
        documento: '',
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        credito: '',
        deuda: '',
        tipo: ''
    })

    // Añadiendo el texto de los input al estado
    const handleChange = (e) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value
        })
    }

    // Verificando que los campos obligatorios esten llenos
    const checkContact = () => {
        const { documento, nombre, email } = contact
        let value = !documento.length || !nombre.length || !email.length
        return value
    }

    // Llamando la mutacion y enviandole la data
    const handleSubmit = (e) => {
        e.preventDefault()
        const { documento, nombre, email, telefono, direccion, tipo } = contact
        putContact({ variables: {
            idContact: idContact,
            documento,
            nombre,
            email,
            telefono,
            direccion,
            tipo
        }})
    }
    
    // Creando el mensaje de SweetAlert2
    const createMessage = (messageError, messageData) => {
        if (messageError) {
            const messageExtensions = messageError.graphQLErrors[0].extensions
            Swal.fire(
                messageError.message,
                messageExtensions.code,
                'error'
            )
            reset()
            if(messageExtensions.code.includes('TOKEN')) navigate('/signin')
        }else if(messageData && messageData.putContact){
            Swal.fire(
                `Se actualizo un ${ type === 'C' ? 'Cliente' : 'Proveedor' }`,
                `Se actualizo el ${ type === 'C' ? 'Cliente' : 'Proveedor' } con el documento: ${data.putContact.documento}`,
                'success'
            )
            return navigate(`/contacts/${type}`)
        }
    }

    useEffect(() => {
      createMessage(error, data)
      if (queryData) setContact(queryData)
    }, [error, data, queryData])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Editar { type === 'C' ? 'Cliente' : 'Proveedor' }</h2>
            <form onSubmit={ handleSubmit }>
                <legend>Llena los campos</legend>

                <div className="campo">
                    <label>Nombre<span style={{color: "red"}}>*</span>:</label>
                    <input type="text" 
                    placeholder={ `Nombre ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } 
                    name="nombre" onChange={ handleChange } value={ contact.nombre }/>
                </div>

                <div className="campo">
                    <label>Documento<span style={{color: "red"}}>*</span>:</label>
                    <input type="text" 
                    placeholder={ `Documento ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } 
                    name="documento" onChange={ handleChange } value={ contact.documento }/>
                </div>

                <div className="campo">
                    <label>Correo<span style={{color: "red"}}>*</span>:</label>
                    <input type="email" 
                    placeholder={ `Correo ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } 
                    name="email" onChange={ handleChange } value={ contact.email }/>
                </div>

                <div className="campo">
                    <label>Telefono:</label>
                    <input type="text" 
                    placeholder={ `Telefono ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } 
                    name="telefono" onChange={ handleChange } value={ contact.telefono ?? '' }/>
                </div>

                <div className="campo">
                    <label>Direccion:</label>
                    <input type="text" 
                    placeholder="Direccion Corta" name="direccion" 
                    onChange={ handleChange } value={ contact.direccion ?? '' }/>
                </div>
                    
                <div className="campo">
                    <label>{ type === 'C' ? 'Deuda' : 'Credito' }:</label>
                    <input type="number" name={ type === 'C' ? 'deuda' : 'credito' } min="0.00" step="0.01" 
                    placeholder={ type === 'C' ? 'Deuda Cliente' : 'Credito Proveedor' } 
                    onChange={ handleChange } value={ type === 'C' ? contact.deuda : contact.credito }/>
                </div>

                <div className="campo">
                    <label>Tipo<span style={{color: "red"}}>*</span>:</label>
                    <select name="tipo" required onChange={ handleChange } value={ contact.tipo }>
                        <option value={ type === 'C' ? 'C' : 'P' }>{ type === 'C' ? 'Cliente' : 'Proveedor' }</option>
                        <option value="C/P">Cliente/Proveedor</option>
                    </select>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" 
                    value={ `Editar ${ type === 'C' ? 'Cliente' : 'Proveedor' }` }
                    disabled={ checkContact() }/>
                </div>
            </form>
        </Fragment>
    )
}

export default UpdateContact