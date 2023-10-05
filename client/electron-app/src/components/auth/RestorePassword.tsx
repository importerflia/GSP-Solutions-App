import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../layout/loading-spinner/LoadingSpinner'
import './auth.css'
import { USER_MUTATIONS } from '../../graphql/User'

const RestorePassword = () => {
    let navigate = useNavigate()
    const [user, setUser] = useState({
        email: ''
    })

    const [resetPass, { loading, error, data, reset }] = useMutation(USER_MUTATIONS.resetPass)

    const checkUser = () => {
        const { email } = user
        let value = !email.length
        return value
    }

    const createMessage = (messageError, messageData) => {
        if (messageError) {
            const messageExtensions = messageError.graphQLErrors[0].extensions
            Swal.fire(
                messageError.message,
                messageExtensions.code,
                'error'
            )
            reset()
        }else if(messageData && messageData.resetPass){
            Swal.fire(
                'Le hemos enviado un codigo de verificación',
                `Se ha sido enviado al email: ${messageData.resetPass.email}`,
                'success'
            )
            return navigate('/formresetpass')
        }
    }

    useEffect(() => {
      createMessage(error, data)
    }, [error, data])

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value 
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        resetPass({variables: {
            email: user.email
        }})
    }

    if (loading) return <LoadingSpinner/>
    
    return (
        <div className="login-container">
            <div className="login">
                <h2>Recuperar Contraseña</h2>
                <div className="contenedor-formulario">
                    <form onSubmit={handleSubmit}>
                        <div className="campo">
                            <label>Correo</label>
                            <input 
                                type='email' 
                                name='email'
                                placeholder='Coloque su correo'
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <input 
                            type='submit' 
                            value='Recuperar Contraseña' 
                            className='btn btn-verde btn-block'
                            disabled={checkUser()}
                        />
                        <div className="redirect-auth">
                            <div className='link-code'>
                                <Link to='/formresetpass'>Si ya posee un codigo de verificacion, presione aqui</Link>
                            </div>
                            <Link to='/signup'>¿No esta registrado? Cree una cuenta</Link>
                            <Link to='/signin'>¿Ya posee cuenta? Inicie Sesión</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RestorePassword