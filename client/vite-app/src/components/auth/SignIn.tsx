import { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../layout/loading-spinner/LoadingSpinner'
import './auth.css'
import { AuthContext } from '../../context/authContext'
import { USER_MUTATIONS } from '../../graphql/User'

const SignIn = () => {
    const context = useContext(AuthContext)
    let navigate = useNavigate()
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const [signIn, { loading, error, data, reset }] = useMutation(USER_MUTATIONS.signIn)

    const checkUser = () => {
        const { email, password } = user
        let value = !email.length || !password.length
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
        }else if(messageData && messageData.signIn){
            Swal.fire(
                'Ha iniciado sesion satisfactoriamente',
                `Ha iniciado sesion con el email: ${user.email}`,
                'success'
            )
            context.signIn(messageData.signIn)
            return navigate('/')
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
        signIn({variables: {
            email: user.email,
            password: user.password
        }})
    }

    if (loading) return <LoadingSpinner/>
    
    return (
        <div className="login-container">
            <div className="login">
                <h2>Iniciar Sesion</h2>
                <div className="contenedor-formulario">
                    <form onSubmit={handleSubmit}>
                        <div className="campo">
                            <label>Correo</label>
                            <input 
                                type='text' 
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
                        <input 
                            type='submit' 
                            value='Iniciar Sesion' 
                            className='btn btn-verde btn-block'
                            disabled={checkUser()}
                        />
                        <div className="redirect-auth">
                            <Link to='/signup'>¿No esta registrado? Cree una cuenta</Link>
                            <Link to='/resetpass'>Olvide mi contraseña</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn