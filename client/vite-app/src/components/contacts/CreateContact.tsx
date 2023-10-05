import { useMutation } from "@apollo/client"
import { Fragment, useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { CONTACT_MUTATIONS } from "../../graphql/Contact"

const CreateContact = () => {
    // Utilizando la mutacion
    const [postContact, { loading, error, data, reset }] = useMutation(CONTACT_MUTATIONS.create)

    const { type } = useParams()

    const [contact, setContact] = useState({
        documento: '',
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        credito: '',
        deuda: '',
        tipo: type
    })

    const navigate = useNavigate()

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
        const { documento, nombre, email, telefono, direccion, credito, deuda, tipo } = contact
        postContact({ variables: {
            documento,
            nombre,
            email,
            telefono,
            direccion,
            credito: credito ? parseInt(credito) : 0,
            deuda: deuda ? parseInt(deuda) : 0,
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
        }else if(messageData && messageData.postContact){
            Swal.fire(
                `Nuevo ${ type === 'C' ? 'Cliente' : 'Proveedor' } Agregado`,
                `Se agrego un ${ type === 'C' ? 'Cliente' : 'Proveedor' } con el documento: ${messageData.postContact.documento}`,
                'success'
            )
            return navigate(`/contacts/${type}`)
        }
    }

    useEffect(() => {
      createMessage(error, data)
    }, [error, data])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Nuevo { type === 'C' ? 'Cliente' : 'Proveedor' }</h2>
            <form onSubmit={ handleSubmit }>
                <legend>Llena los campos</legend>

                <div className="campo">
                    <label>Nombre<span style={{color: "red"}}>*</span>:</label>
                    <input type="text" placeholder={ `Nombre ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } name="nombre" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Documento<span style={{color: "red"}}>*</span>:</label>
                    <input type="text" placeholder={ `Documento ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } name="documento" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Correo<span style={{color: "red"}}>*</span>:</label>
                    <input type="email" placeholder={ `Correo ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } name="email" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Telefono:</label>
                    <input type="text" placeholder={ `Telefono ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } name="telefono" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Direccion:</label>
                    <input type="text" placeholder="Direccion Corta" name="direccion" onChange={ handleChange }/>
                </div>
                    
                <div className="campo">
                    <label>{ type === 'C' ? 'Deuda' : 'Credito' }:</label>
                    <input type="number" name={ type === 'C' ? 'deuda' : 'credito' } min="0.00" step="0.01" 
                    placeholder={ type === 'C' ? 'Deuda Cliente' : 'Credito Proveedor' } onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Tipo<span style={{color: "red"}}>*</span>:</label>
                    <select name="tipo" required onChange={ handleChange }>
                    <option value={ type === 'C' ? 'C' : 'P' }>{ type === 'C' ? 'Cliente' : 'Proveedor' }</option>
                        <option value="C/P">Cliente/Proveedor</option>
                    </select>
                </div>
                
                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value={ `Agregar ${ type === 'C' ? 'Cliente' : 'Proveedor' }` } 
                    disabled={ checkContact() }/>
                </div>
            </form>
        </Fragment>
    )
}

export default CreateContact