import { useMutation, useQuery } from "@apollo/client"
import { Fragment, useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import { GraphQLError } from "graphql"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PRODUCT_MUTATIONS, PRODUCT_QUERIES } from "../../graphql/Product"

const getOneProduct = (idProduct) => {
    const { error, data } = useQuery(PRODUCT_QUERIES.getOne, {
        variables: { idProduct }
    })

    if (error) {
        throw new GraphQLError('Ha ocurrido un error 1', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'FE/G1PR'
            }
        })
    }

    if (data && data.getOneProduct) {
        return data.getOneProduct
    }
}

const UpdateProduct = () => {

    // Obteniendo id
    const { idProduct } = useParams()

    // Creando objeto para navegar entre rutas
    const navigate = useNavigate()

    // Utilizando query
    const queryData = getOneProduct(idProduct)

    // Utilizando la mutacion
    const [putProduct, { loading, error, data, reset }] = useMutation(PRODUCT_MUTATIONS.update)

    const [product, setProduct] = useState({
        _id: '',
        codigo: '',
        tipo: '',
        descripcion: '',
        precio_costo: '',
        precio_venta: '',
        cantidad: ''
    })

    // Añadiendo el texto de los input al estado
    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    }

    // Verificando que los campos obligatorios esten llenos
    const checkProduct = () => {
        const { codigo, precio_costo, precio_venta } = product
        let value = !codigo.length || !String(precio_costo).length || !String(precio_venta).length
        return value
    }

    // Llamando la mutacion y enviandole la data
    const handleSubmit = (e) => {
        e.preventDefault()
        const { tipo, descripcion, precio_costo, precio_venta, cantidad } = product
        putProduct({ variables: {
            idProduct: idProduct,
            tipo,
            descripcion,
            precioCosto: precio_costo ? parseFloat(precio_costo) : 0,
            precioVenta: precio_venta ? parseFloat(precio_venta) : 0,
            cantidad: cantidad ? parseInt(cantidad) : 0
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
        }else if(messageData && messageData.putProduct){
            Swal.fire(
                'Se actualizo el producto',
                `Se actualizo el producto con el codigo: ${data.putProduct.codigo}`,
                'success'
            )
            return navigate('/products')
        }
    }

    useEffect(() => {
      if (queryData) setProduct(queryData)
      createMessage(error, data)
    }, [queryData, error, data])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Editar Producto</h2>
            <form onSubmit={ handleSubmit }>
                <legend>Llena los campos</legend>

                <div className="campo">
                    <label>Codigo:</label>
                    <input type="text" placeholder="Codigo Producto" name="codigo" value={ product.codigo } onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Tipo:</label>
                    <input type="text" placeholder="Tipo Producto" name="tipo" 
                    value={ product.tipo ? product.tipo : '' } onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Descripcion:</label>
                    <input type="text" placeholder="Descripcion Corta" name="descripcion" 
                    value={ product.descripcion ? product.descripcion : '' } maxLength={60} onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Precio Costo:</label>
                    <input type="number" name="precio_costo" min="0.00" step="0.01" placeholder="Precio Costo" value={ product.precio_costo } onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Precio Venta:</label>
                    <input type="number" name="precio_venta" min="0.00" step="0.01" placeholder="Precio Venta" value={ product.precio_venta } onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Cantidad:</label>
                    <input type="number" name="cantidad" min="0" step="1" placeholder="Cantidad" value={ product.cantidad } onChange={ handleChange }/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Editar Producto" disabled={ checkProduct() }/>
                </div>
            </form>
        </Fragment>
    )
}

export default UpdateProduct