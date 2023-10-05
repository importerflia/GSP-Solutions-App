import { useEffect, Fragment } from "react"
import { useQuery } from "@apollo/client"
import Swal from "sweetalert2"
import Select from "react-select"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { TRANSACTION_QUERIES } from "../../graphql/Transaction"

const FormSearchTransaction = (props) => {
    const { transaction } = props
    const handleTransactionChange = props.hasOwnProperty('handleTransactionChange') ? props.handleTransactionChange : undefined
    const update = props.hasOwnProperty('update') ? props.update : false

    const { loading, error, data } = useQuery(TRANSACTION_QUERIES.get)
    const navigate = useNavigate()

    let transactionOptions = []

    if (data && data.getTransactions) {
        data.getTransactions.forEach((transaction) => {
            transactionOptions.push({
                value: transaction._id,
                label: `${transaction.codigo}, ${transaction.contacto.documento}`
            })
        })
    }

    // Creando el mensaje de SweetAlert2
    const createMessage = (messageError) => {
        if (messageError) {
            const messageExtensions = messageError.graphQLErrors[0].extensions
            Swal.fire(
                messageError.message,
                messageExtensions.code,
                'error'
            )
            if (messageExtensions.code.includes('TOKEN')) navigate('/signin')
        }
    }

    useEffect(() => {
      createMessage(error)
    }, [error])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <form style={ update ? { display: "none" } : {}}>
                <legend>Selecciona una Transaccion</legend>
                <div style={{ padding: ".5rem 2rem", marginBottom: "2rem" }}>
                    <Select 
                        options={ transactionOptions }
                        isClearable
                        backspaceRemovesValue
                        required={ !update ? true : false }
                        placeholder='Seleccione una transaccion'
                        onChange={ (e) => handleTransactionChange(e, data) }
                    />
                </div>
            </form>

            {   
                transaction 
                ? <div className="ficha-cliente">
                    <h3>Datos de la Transaccion</h3>
                    <p>Codigo: { transaction.codigo }</p>
                    <p>Contacto: { transaction.contacto.nombre }, { transaction.contacto.documento }</p>
                    <p>Cantidad Pagada: { transaction.cantidad_pagada.toFixed(2) }</p>
                    <p>Total: { transaction.total.toFixed(2) }</p>
                </div>
                : ''
            }
        </Fragment>
    )
}

export default FormSearchTransaction