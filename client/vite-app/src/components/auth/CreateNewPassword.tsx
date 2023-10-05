import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../layout/loading-spinner/LoadingSpinner'
import './auth.css'
import { USER_MUTATIONS } from '../../graphql/User'

const CreateNewPassword = () => {
    let navigate = useNavigate()
    const [user, setUser] = useState({
        code: '',
        password: '',
        confirmPassword: ''
    })

    const [formResetPass, { loading, error, data, reset }] = useMutation(USER_MUTATIONS.formResetPass)

    const checkUser = () => {
        const { code, password, confirmPassword } = user
        let value = !code.length || !password.length || !confirmPassword.length
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
        }else if(messageData && messageData.formResetPass){
            Swal.fire(
                messageData.formResetPass,
                `Ya puede iniciar sesión`,
                'success'
            )
            return navigate('/signin')
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
        formResetPass({variables: user})
    }

    if (loading) return <LoadingSpinner/>
    
    return (
        <div className="login-container">
            <div className="login">
                <h2>Recuperar Contraseña</h2>
                <div className="contenedor-formulario">
                    <form onSubmit={handleSubmit}>
                        <div className="campo">
                            <label>Codigo de Confirmación</label>
                            <input 
                                type='text' 
                                name='code'
                                placeholder='Coloque el codigo de confirmacion'
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="campo">
                            <label>Nueva Contraseña</label>
                            <input 
                                type='text' 
                                name='password'
                                placeholder='Coloque su nueva contraseña'
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="campo">
                            <label>Confirmar Contraseña</label>
                            <input 
                                type='text' 
                                name='confirmPassword'
                                placeholder='Confirme su contraseña'
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
                            <Link to='/resetpass'>Si no posee codigo de confirmacion, presione aqui</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateNewPassword