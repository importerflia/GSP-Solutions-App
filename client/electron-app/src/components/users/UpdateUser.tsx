import { useMutation, useQuery } from "@apollo/client"
import { Fragment, useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import { GraphQLError } from "graphql"
import FormSearchRoles from "./FormSearchRoles"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { USER_MUTATIONS, USER_QUERIES } from "../../graphql/User"

const getOneUser = (idUser) => {
    const { error, data } = useQuery(USER_QUERIES.getOne, {
        variables: { idUser }
    })

    if (error) {
        throw new GraphQLError('Ha ocurrido un error 4', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'FE/G1PR'
            }
        })
    }

    if (data && data.getOneUser) {
        return data.getOneUser
    }
}

const UpdateUser = () => {

    // Obteniendo id
    const { idUser } = useParams()

    // Creando objeto para navegar entre rutas
    const navigate = useNavigate()

    // Utilizando query
    const queryData = getOneUser(idUser)

    // Utilizando la mutacion
    const [putUser, { loading, error, data, reset }] = useMutation(USER_MUTATIONS.update)

    const [user, setUser] = useState({
        _id: '',
        username: '',
        email: '', 
        roles: []
    })

    // Añadiendo el texto de los input al estado
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleRoleChange = (e, data) => {
        if (e){
            const roleNames = []
            data.getRoles.forEach((role) => {
                e.forEach((value) => {
                    if (role._id == value.value){
                        roleNames.push({name: role.name})
                    }
                })
            })
            setUser({
                ...user,
                roles: roleNames
            })
        }
    }

    // Verificando que los campos obligatorios esten llenos
    const checkUser = () => {
        const { username, email } = user
        let value = !username.length || !email.length
        return value
    }

    // Llamando la mutacion y enviandole la data
    const handleSubmit = (e) => {
        e.preventDefault()
        const { username, email, roles } = user
        putUser({ variables: {
            idUser: idUser,
            username,
            email,
            roles
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
            if (messageExtensions.code.includes('TOKEN')) navigate('/signin')
        }else if(messageData && messageData.putUser){
            Swal.fire(
                'Se actualizo un usuario',
                `Se actualizo el usuario con el email: ${data.putUser.email}`,
                'success'
            )
            return navigate('/users')
        }
    }

    useEffect(() => {
      createMessage(error, data)
      if (queryData) setUser(queryData)
    }, [error, data, queryData])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Editar Usuario</h2>
            <form onSubmit={ handleSubmit }>
                <legend>Llena los campos</legend>

                <div className="campo">
                    <label>Nombre de Usuario<span style={{color: "red"}}>*</span>:</label>
                    <input type="text" placeholder="Nombre de Usuario" name="username" 
                    onChange={ handleChange } value={ user.username } readOnly={ true }/>
                </div>

                <div className="campo">
                    <label>Correo<span style={{color: "red"}}>*</span>:</label>
                    <input type="text" placeholder="Correo" name="email" 
                    onChange={ handleChange } value={ user.email } readOnly={ true }/>
                </div>

                <FormSearchRoles handleRoleChange={ handleRoleChange } user={ user }/>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Editar Usuario" disabled={ checkUser() }/>
                </div>
            </form>
        </Fragment>
    )
}

export default UpdateUser