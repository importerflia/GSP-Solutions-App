import { useState, useEffect, Fragment } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client"
import Swal from "sweetalert2"
import Select from "react-select"
import FormSearchContact from "./FormSearchContact"
import FormSearchProduct from "./FormSearchProduct"
import FormQuantityProduct from "./FormQuantityProduct"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { TRANSACTION_MUTATIONS } from "../../graphql/Transaction"

const CreateTransaction = () => {
    const { type } = useParams()
    const transactionLabelType = type === 'V' ? 'Venta' : 'Compra'

    const [contact, setContact] = useState<{[key:string]: any}>()
    const [products, setProducts] = useState<{[key:string]: any}[]>([])
    const [total, setTotal] = useState(0)
    const [plazo, setPlazo] = useState(0)

    const [postTransaction, { loading, error, data, reset }] = useMutation(TRANSACTION_MUTATIONS.create)

    const navigate = useNavigate()
    
    const handleContactChange = (e, data) => {
        if (e){
            data.getContacts.forEach((contact) => {
                if (contact._id == e.value){
                    setContact(contact)
                }
            })
        }
    }

    const handleProductChange = (e, data) => {
        if (e) {
            data.getProducts.forEach((product) => {
                const { _id, codigo, tipo, descripcion, precio_costo, precio_venta } = product
                const productState = products.filter((productSt) => productSt.producto === product._id)
                if (product._id === e.value && productState.length === 0){
                    setProducts([...products, { 
                        producto: _id, 
                        cantidad: 0, 
                        codigo,
                        tipo,
                        descripcion,
                        precio_costo,
                        precio_venta
                    }])
                }
            }) 
        }      
    }

    const addProduct = (i) => {
        const allProducts = [...products]

        allProducts[i].cantidad++

        setProducts(allProducts)
    }

    const decreaseProduct = (i) => {
        const allProducts = [...products]

        if(allProducts[i].cantidad === 0) return

        allProducts[i].cantidad--

        setProducts(allProducts)
    }

    const handleQuantityChange = (e, i) => {
        const allProducts = [...products]

        allProducts[i].cantidad = parseInt(e.target.value)

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
            const productPrice = type === 'V' ? product.precio_venta : product.precio_costo
            newTotal += (product.cantidad * productPrice)
        })

        setTotal(newTotal)
    }

    const deleteProduct = (idProduct) => {
        const allProducts = products.filter(product => product.producto !== idProduct)
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
        }else if (messageData && messageData.postTransaction){
            Swal.fire(
                `Nuevo ${ transactionLabelType } Agregado`,
                `Se agrego un ${ transactionLabelType } con el codigo: ${messageData.postTransaction.codigo}`,
                'success'
            )
            return navigate(`/transactions/${type}`)
        }
    }

    useEffect(() => {
        updateTotal()
        createMessage(error, data)
    }, [products, error, data])

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
                producto,
                cantidad
            }
        })

        const transaction = {
            "contacto": contact._id,
            "pedido": productsTransaction,
            "plazo": plazo,
            "total": total,
            "tipo": `T${ type }`
        }

        postTransaction({
            variables: transaction
        })
    }

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Nuevo { transactionLabelType }</h2>

            <FormSearchContact type={ type } contact={ contact } handleContactChange={ handleContactChange } />

            <FormSearchProduct handleProductChange={ handleProductChange } />

            <ul className="resumen">
                {products.map(
                    (product, index) => <FormQuantityProduct 
                                            key={ product.producto } 
                                            type={ type } 
                                            product={ product } 
                                            addProduct={ addProduct }
                                            decreaseProduct={ decreaseProduct }
                                            index={ index }
                                            handleQuantityChange={ handleQuantityChange }
                                            deleteProduct={ deleteProduct }
                                        />
                )}
            </ul>
            <p className="total">Total a Pagar: <span>{ total.toFixed(2) }</span></p>
            <form>
                <legend>Selecciona un plazo de pago</legend>
                <div style={{ padding: ".5rem 2rem", marginBottom: "2rem" }}>
                    <Select 
                        options={ plazoOptions as any }
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
                    <input type="submit" className="btn btn-verde btn-block" value={ `Realizar ${ transactionLabelType }` } />
                </form>
                : null
            }
        </Fragment>
    )
}

export default CreateTransaction