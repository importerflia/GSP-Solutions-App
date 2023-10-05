import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../layout/loading-spinner/LoadingSpinner'
import { USER_MUTATIONS } from '../../graphql/User'
import './auth.css'

const SignUp = () => {
    let navigate = useNavigate()
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [signUp, { loading, error, data, reset }] = useMutation(USER_MUTATIONS.signUp)

    const checkUser = () => {
        const { username, email, password, confirmPassword } = user
        let value = !username.length || !email.length || !password.length || !confirmPassword.length
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
        }else if(messageData && messageData.signUp){
            Swal.fire(
                'Se ha registrado satisfactoriamente',
                `Revise su email: ${user.email} para confirmar su cuenta.`,
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
        signUp({variables: {
            username: user.username,
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword
        }})
    }

    if (loading) return <LoadingSpinner/>
    
    return (
        <div className="login-container">
            <div className="login">
                <h2>Registrase</h2>
                <div className="contenedor-formulario">
                    <form onSubmit={handleSubmit}>
                        <div className="campo">
                            <label>Nombre de Usuario</label>
                            <input 
                                type='text' 
                                name='username'
                                placeholder='Coloque su nombre de usuario'
                                required
                                onChange={handleChange}
                            />
                        </div>
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
                        <div className="campo">
                            <label>Contraseña</label>
                            <input 
                                type='password' 
                                name='password'
                                placeholder='Coloque su contraseña'
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="campo">
                            <label>Confirmar Contraseña</label>
                            <input 
                                type='password' 
                                name='confirmPassword'
                                placeholder='Repita su contraseña'
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <input 
                            type='submit' 
                            value='Registrarse' 
                            className='btn btn-verde btn-block'
                            disabled={checkUser()}
                        />
                        <div className="redirect-auth">
                            <Link to='/signin'>¿Ya posee cuenta? Incicie Sesión</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp