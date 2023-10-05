import { useMutation } from "@apollo/client"
import { Fragment, useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PRODUCT_MUTATIONS } from "../../graphql/Product"

const CreateProduct = () => {
    // Utilizando la mutacion
    const [postProduct, { loading, error, data, reset }] = useMutation(PRODUCT_MUTATIONS.create)

    const [product, setProduct] = useState({
        codigo: '',
        tipo: '',
        descripcion: '',
        precio_costo: '',
        precio_venta: '',
        cantidad: ''
    })

    const navigate = useNavigate()

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
        const { codigo, tipo, descripcion, precio_costo, precio_venta, cantidad } = product
        postProduct({ variables: {
            codigo,
            tipo,
            descripcion,
            precioCosto: parseFloat(precio_costo),
            precioVenta: parseFloat(precio_venta),
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
        }else if(messageData && messageData.postProduct){
            Swal.fire(
                'Nuevo producto Agregado',
                `Se agrego un producto con el codigo: ${data.postProduct.codigo}`,
                'success'
            )
            return navigate('/products')
        }
    }

    useEffect(() => {
        createMessage(error, data)
    }, [error, data])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Nuevo Producto</h2>
            <form onSubmit={ handleSubmit }>
                <legend>Llena los campos</legend>

                <div className="campo">
                    <label>Codigo<span style={{color: "red"}}>*</span>:</label>
                    <input type="text" placeholder="Codigo Producto" name="codigo" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Tipo:</label>
                    <input type="text" placeholder="Tipo Producto" name="tipo" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Descripcion:</label>
                    <input type="text" placeholder="Descripcion Corta" name="descripcion" maxLength={60} onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Precio Costo<span style={{color: "red"}}>*</span>:</label>
                    <input type="number" name="precio_costo" min="0.00" step="0.01" placeholder="Precio Costo" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Precio Venta<span style={{color: "red"}}>*</span>:</label>
                    <input type="number" name="precio_venta" min="0.00" step="0.01" placeholder="Precio Venta" onChange={ handleChange }/>
                </div>

                <div className="campo">
                    <label>Cantidad:</label>
                    <input type="number" name="cantidad" min="0" step="1" placeholder="Cantidad" onChange={ handleChange }/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Agregar Producto" 
                    disabled={ checkProduct() }/>
                </div>
            </form>
        </Fragment>
    )
}

export default CreateProduct