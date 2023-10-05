import { useState, useEffect, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client"
import Swal from "sweetalert2"
import FormSearchTransaction from "./FormSearchTransaction"
import { FaMinus, FaPlus } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PAYMENT_MUTATIONS } from "../../graphql/Payment"

const CreatePayment = () => {
    const [transaction, setTransaction] = useState<{[key:string]: any}>()
    const [total, setTotal] = useState(0)

    const [postPayment, { loading, error, data, reset }] = useMutation(PAYMENT_MUTATIONS.create)

    const navigate = useNavigate()

    const handleTransactionChange = (e, data) => {
        if(e){
            data.getTransactions.forEach((transaction) => {
                if(transaction._id === e.value){
                    setTransaction(transaction)
                }
            })
        }
    }

    const addProduct = () => {
        let newTotal = total

        newTotal++

        setTotal(newTotal)
    }

    const decreaseProduct = () => {
        let newTotal = total

        newTotal--

        setTotal(newTotal)
    }

    const handleQuantityChange = (e) => {
        let newTotal = total

        newTotal = parseFloat(e.target.value)

        if(!e.target.value) newTotal = 0

        setTotal(newTotal)
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
        }else if (messageData && messageData.postPayment){
            Swal.fire(
                `Nuevo Pago Agregado`,
                `Se agrego un pago con el codigo: ${messageData.postPayment.codigo}`,
                'success'
            )
            return navigate(`/payments`)
        }
    }

    useEffect(() => {
        createMessage(error, data)
    }, [error, data])


    const handleSubmit = (e) => {
        e.preventDefault()
        const payment = {
            "transaccion": transaction._id,
            "total": total
        }

        postPayment({
            variables: payment
        })
    }

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Nuevo Pago</h2>

            <FormSearchTransaction handleTransactionChange={ handleTransactionChange } transaction={ transaction }/>

            <ul className="resumen">
                <li>
                    <div className="texto-producto" style={{ paddingBottom: "20px" }}>
                        <p className="nombre">Coloque la cantidad a pagar</p>
                    </div>
                    <div className="acciones">
                        <div className="contenedor-cantidad">
                            <i className="btn-minus" onClick={ () => decreaseProduct() }>
                                <FaMinus/>
                            </i>
                            
                            <input 
                                type="number" 
                                name="cantidad" 
                                style={{textAlign: "center"}} 
                                value={ total }
                                step="0.01"
                                onChange={ (e) => handleQuantityChange(e) }
                            />

                            <i className="btn-plus" onClick={ () => addProduct()}>
                                <FaPlus/>
                            </i>
                        </div>
                    </div>
                </li>
            </ul>
            <p className="total">Total a Pagar: <span>{ total.toFixed(2) }</span></p>

            {
                total > 0
                ? <form onSubmit={ handleSubmit }>
                    <input type="submit" className="btn btn-verde btn-block" value='Realizar Pago' />
                </form>
                : null
            }
        </Fragment>
    )
}

export default CreatePayment