import { useEffect, useState, useContext } from "react"
import { useMutation } from "@apollo/client"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import ProductTransaction from "./ProductTransaction"
import SectionToggle from "../layout/SectionToggle"
import { FaAngleDown, FaPenAlt, FaTimes, FaFileInvoiceDollar } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { TRANSACTION_MUTATIONS } from "../../graphql/Transaction"
import { AuthContext } from "../../context/authContext"

const Transaction = ({ transaction, reRender, type }) => {
    const [deleteTransaction, { loading, data, error }] = useMutation(TRANSACTION_MUTATIONS.delete)
    const contactLabelType = type === 'V' ? 'Cliente' : 'Proveedor'
    const transactionLabelType = type == 'V' ? 'Venta' : 'Compra'
    const [isVisible, setIsVisible] = useState(false)
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const handleProductClick = () => {
        setIsVisible(!isVisible)
    }

    const handleClick = (idTransaction) => {
        Swal.fire({
            title: 'Esta seguro?',
            text: "No podra revertir los cambios!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminala!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTransaction({ variables: {
                    idTransaction: idTransaction
                }})
                if (!error){
                    Swal.fire(
                        'Transaccion Eliminada!',
                        `Se elimino la transaccion con el codigo: ${transaction.codigo}.`,
                        'success'
                    )
                }
                reRender()
            }
        })
    }

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
        reRender()
        createMessage(error)
    }, [error, data])

    if (loading) return <LoadingSpinner/>

    return(
        <li className="pedido">
            <div className="info-pedido">
                <p className="id">{ transaction.codigo }</p>
                <p className="nombre">{ contactLabelType }: { transaction.contacto.nombre }, { transaction.contacto.documento }</p>
                <p className="nombre">Cantidad Pagada: { transaction.cantidad_pagada.toFixed(2) }</p>

                <div className="articulos-pedido">
                    <SectionToggle isVisible={ isVisible }>
                        <section>
                            <p className="productos">Artículos { transactionLabelType }: </p>
                            <ul>
                                {transaction.pedido.map((pedido) => {
                                    return <ProductTransaction key={ pedido._id } pedido={ pedido } type={ type }/>
                                })}
                            </ul>
                        </section>
                    </SectionToggle>
                    <Link to='#' className="btn-toggle" onClick={ handleProductClick }>
                        <div className="contenedor-link">
                            <i><FaAngleDown/></i>
                            Productos
                        </div>
                    </Link>
                </div>
                <p className="total">Total: { transaction.total.toFixed(2) }</p>
            </div>

            {   context.isModerator
                ? <div className="acciones">
                    <Link to={ `/transactions/${type}/edit/${transaction._id}` } className="btn btn-azul">
                        <i><FaPenAlt/></i>
                        Editar { transactionLabelType }
                    </Link>

                    <button type="button" className="btn btn-rojo btn-eliminar" onClick={ () => handleClick(transaction._id) }>
                        <i><FaTimes/></i>
                        Eliminar { transactionLabelType }
                    </button>

                    <Link to={`/reports/invoice/${transaction._id}`} className="btn btn-verde">
                        <i><FaFileInvoiceDollar/></i>
                        Factura de { transactionLabelType }
                    </Link>
                </div>
                : null
            }
        </li>
    )
}

export default Transaction