import { useEffect, useState, useContext } from "react"
import { useMutation } from "@apollo/client"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import SectionToggle from "../layout/SectionToggle"
import TransactionPayment from "./TransactionPayment"
import { FaAngleDown, FaPenAlt, FaTimes } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PAYMENT_MUTATIONS } from "../../graphql/Payment"
import { AuthContext } from "../../context/authContext"

const Payment = ({ payment, reRender }) => {
    const [deletePayment, { loading, data, error }] = useMutation(PAYMENT_MUTATIONS.delete)
    const [isVisible, setIsVisible] = useState(false)
    const paymentLabelType = payment.tipo.includes('V') ? 'Venta' : 'Compra'
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const handleProductClick = () => {
        setIsVisible(!isVisible)
    }

    const handleClick = (idPayment) => {
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
                deletePayment({ variables: {
                    idPayment: idPayment
                }})
                if (!error){
                    Swal.fire(
                        'Pago eliminado Eliminada!',
                        `Se elimino el pago con el codigo: ${payment.codigo}.`,
                        'success'
                    )
                    reRender()
                }
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
                <p className="id">{ payment.codigo }</p>
                <p className="nombre">Tipo de Pago: Pago de { paymentLabelType }</p>

                <div className="articulos-pedido">
                    <SectionToggle isVisible={ isVisible }>
                        <section>
                            <p className="productos">Datos Transaccion: </p>
                            <ul>
                                <TransactionPayment key={ payment.transaccion._id } transaction={ payment.transaccion } type={ payment.tipo }/>
                            </ul>
                        </section>
                    </SectionToggle>
                    <Link to='#' className="btn-toggle" onClick={ handleProductClick }>
                        <div className="contenedor-link">
                            <i><FaAngleDown/></i>
                            Transaccion
                        </div>
                    </Link>
                </div>
                <p className="total">Total Pago: { payment.total.toFixed(2) }</p>
            </div>

            {   context.isModerator
                ? <div className="acciones">
                    <Link to={ `/payments/edit/${payment._id}` } className="btn btn-azul">
                        <i><FaPenAlt/></i>
                        Editar Pago
                    </Link>

                    <button type="button" className="btn btn-rojo btn-eliminar" onClick={ () => handleClick(payment._id) }>
                        <i><FaTimes/></i>
                        Eliminar Pago
                    </button>
                </div>
                : null
            }
        </li>
    )
}

export default Payment