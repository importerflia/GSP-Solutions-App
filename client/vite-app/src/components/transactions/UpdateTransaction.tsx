import { useState, useEffect, Fragment } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client"
import { GraphQLError } from "graphql"
import Swal from "sweetalert2"
import Select from "react-select"
import FormSearchContact from "./FormSearchContact"
import FormSearchProduct from "./FormSearchProduct"
import FormQuantityProduct from "./FormQuantityProduct"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { TRANSACTION_MUTATIONS, TRANSACTION_QUERIES } from "../../graphql/Transaction"

const getOneTransaction = (idTransaction) => {
    const { error, data } = useQuery(TRANSACTION_QUERIES.getOne, {
        variables: { idTransaction }
    })

    if (error) {
        throw new GraphQLError('Ha ocurrido un error 3', {
            extensions: {
                code: 'UNKNOW_ERROR',
                pathName: 'FE/G1TR'
            }
        })
    }

    if (data && data.getOneTransaction) {
        return data.getOneTransaction
    }
}

const UpdateTransaction = () => {
    const { type, idTransaction } = useParams()
    const queryData = getOneTransaction(idTransaction)
    const transactionLabelType = type === 'V' ? 'Venta' : 'Compra'

    const [contact, setContact] = useState<{[key:string]: any}>()
    const [products, setProducts] = useState<{[key:string]: any}[]>([])
    const [total, setTotal] = useState(0)
    const [plazo, setPlazo] = useState(0)

    const [putTransaction, { loading, error, data, reset }] = useMutation(TRANSACTION_MUTATIONS.update)

    const navigate = useNavigate()

    const handleProductChange = (e, data) => {
        if (e) {
            data.getProducts.forEach((product) => {
                const { _id, codigo, tipo, descripcion, precio_costo, precio_venta } = product
                const productState = products.filter((productSt) => productSt.producto._id === product._id)
                if (product._id === e.value && productState.length === 0){
                    setProducts([...products, { 
                        producto: {
                            _id,
                            codigo,
                            tipo,
                            descripcion,
                            precio_costo,
                            precio_venta
                        },
                        cantidad: 0
                    }])
                }
            }) 
        }      
    }

    const addProduct = (i) => {

        const allProducts = products.map((product) => {
            return {
                producto: product.producto,
                cantidad: product.cantidad
            }
        })

        allProducts[i].cantidad++

        setProducts(allProducts)
    }

    const decreaseProduct = (i) => {
        const allProducts = products.map((product) => {
            return {
                producto: product.producto,
                cantidad: product.cantidad
            }
        })

        if(allProducts[i].cantidad === 0) return

        allProducts[i].cantidad--

        setProducts(allProducts)
    }

    const handleQuantityChange = (e, i) => {
        const allProducts = products.map((product) => {
            return {
                producto: product.producto,
                cantidad: product.cantidad
            }
        })

        allProducts[i].cantidad = parseInt(e.target.value).toFixed()

        if(!e.target.value) allProducts[i].cantidad = 0

        setProducts(allProducts)
    }

    const updateTotal = () => {
        if(products.length === 0){
            setTotal(0)
            return
        }

        let newTotal = 0

        products.map((product) => {
            const productPrice = type === 'V' ? product.producto.precio_venta : product.producto.precio_costo
            newTotal += (product.cantidad * productPrice)
        })

        setTotal(newTotal)
    }

    const deleteProduct = (idProduct) => {
        const allProducts = products.filter(product => product.producto._id !== idProduct)
        setProducts(allProducts)
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
        }else if (messageData && messageData.putTransaction){
            Swal.fire(
                `${ transactionLabelType } Actualizado`,
                `Se actualizo el ${ transactionLabelType } con el codigo: ${messageData.putTransaction.codigo}`,
                'success'
            )
            return navigate(`/transactions/${type}`)
        }
    }

    useEffect(() => {
        if(queryData){
            if(!contact) setContact(queryData.contacto)
            if(!products.length) setProducts(queryData.pedido)
            if(!plazo) setPlazo(queryData.plazo)
        }
        updateTotal()
        createMessage(error, data)
    }, [products, error, data, queryData])

    const plazoOptions = [
        {value: 0, label: 'Pago Inmediato'},
        {value: 7, label: 'Una (1) Semana'},
        {value: 15, label: 'Una (2) Semana'},
        {value: 30, label: 'Un (1) Mes'}
    ]

    const handlePlazoChange = (e) => {
        if(e){
            setPlazo(e.value)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const productsTransaction = products.map((product) => {
            const { producto, cantidad } = product
            return {
                producto: producto._id,
                cantidad: parseInt(cantidad)
            }
        })

        const updatedTransaction = {
            idTransaction,
            "pedido": productsTransaction,
            plazo,
            total,
            "tipo": queryData.tipo
        }

        putTransaction({
            variables: updatedTransaction
        })
    }

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Editar { transactionLabelType }</h2>

            <FormSearchContact type={ type } contact={ contact } update={ true }/>

            <FormSearchProduct handleProductChange={ handleProductChange } />

            <ul className="resumen">
                {products.map(
                    (product, index) => <FormQuantityProduct 
                                            key={ product.producto._id } 
                                            type={ type } 
                                            product={ product } 
                                            addProduct={ addProduct }
                                            decreaseProduct={ decreaseProduct }
                                            index={ index }
                                            handleQuantityChange={ handleQuantityChange }
                                            deleteProduct={ deleteProduct }
                                            update={ true }
                                        />
                )}
            </ul>
            <p className="total">Total a Pagar: <span>{ total.toFixed(2) }</span></p>
            <form>
                <legend>Selecciona un plazo de pago</legend>
                <div style={{ padding: ".5rem 2rem", marginBottom: "2rem" }}>
                    <Select 
                        options={ plazoOptions as any }
                        value={ plazoOptions.filter((option) => option.value === plazo) }
                        isClearable
                        required
                        backspaceRemovesValue
                        placeholder='Seleccione un plazo de pago'
                        onChange={ handlePlazoChange }
                    />
                </div>
            </form>

            {
                total > 0
                ? <form onSubmit={ handleSubmit }>
                    <input type="submit" className="btn btn-verde btn-block" value={ `Editar ${ transactionLabelType }` } />
                </form>
                : null
            }
        </Fragment>
    )
}

export default UpdateTransaction