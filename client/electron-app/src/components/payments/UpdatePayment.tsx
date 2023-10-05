import { useState, useEffect, Fragment } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client"
import Swal from "sweetalert2"
import FormSearchTransaction from "./FormSearchTransaction"
import { FaMinus, FaPlus } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PAYMENT_MUTATIONS, PAYMENT_QUERIES } from "../../graphql/Payment"

const getOnePayment = (idPayment) => {
    const { error, data } = useQuery(PAYMENT_QUERIES.getOne, {
        variables: { idPayment }
    })

    if (error) {
        const errorExtensions = error.graphQLErrors[0].extensions
        Swal.fire(
            error.message,
            errorExtensions.code as string,
            'error'
        )
    }

    if (data && data.getOnePayment) {
        return data.getOnePayment
    }
}

const UpdatePayment = () => {
    const { idPayment } = useParams()
    const [transaction, setTransaction] = useState<{[key:string]: any}>()
    const [total, setTotal] = useState(0)

    const [putPayment, { loading, error, data, reset }] = useMutation(PAYMENT_MUTATIONS.update)

    const queryData = getOnePayment(idPayment)

    const navigate = useNavigate()

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
        }else if (messageData && messageData.putPayment){
            Swal.fire(
                `Pago Actualizado`,
                `Se actualizo un pago con el codigo: ${messageData.putPayment.codigo}`,
                'success'
            )
            return navigate(`/payments`)
        }
    }

    useEffect(() => {
        if(queryData){
            if(!transaction) setTransaction(queryData.transaccion)
            if(!total) setTotal(queryData.total)
        }
        createMessage(error, data)
    }, [error, data, queryData])


    const handleSubmit = (e) => {
        e.preventDefault()
        const payment = {
            idPayment,
            total,
            "tipo": queryData.tipo
        }

        putPayment({
            variables: payment
        })
    }

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Editar Pago</h2>

            <FormSearchTransaction transaction={ transaction } update={ true }/>

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
                    <input type="submit" className="btn btn-verde btn-block" value='Guardar Pago' />
                </form>
                : null
            }
        </Fragment>
    )
}

export default UpdatePayment