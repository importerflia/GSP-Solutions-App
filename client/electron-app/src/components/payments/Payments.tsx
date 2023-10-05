import { useEffect, useState, Fragment, useContext } from "react"
import { useQuery } from "@apollo/client"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import Payment from "./Payment"
import { FaPlusCircle } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PAYMENT_QUERIES } from "../../graphql/Payment"
import { AuthContext } from "../../context/authContext"
import { massiveData } from "../../lib/functions"


const Payments = () => {
    const { loading, error, data, refetch } = useQuery(PAYMENT_QUERIES.get)
    const [payments, setPayments] = useState([])
    const [dataFile, setFile] = useState({file: undefined, element: undefined})
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const reRender = () => {
        refetch()
        if (data) setPayments(data.getPayments)
    }

    const handleFileChange = (e) => {
        setFile({file: e.target.files[0], element: e.target})
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
        reRender()
        createMessage(error)
    }, [data, error])

    if (loading) return <LoadingSpinner/>

    return(
        <Fragment>
            <h2>Pagos</h2>

            {   context.isModerator
                ? <Fragment>
                    <Link to='/payments/new' className="btn btn-verde nvo-cliente">
                        <i><FaPlusCircle/></i>
                        Nuevo Pago
                    </Link>

                    <form onSubmit={ (e) => massiveData(e, dataFile, 'PG', 'pagos', reRender, setFile) }>
                        <div className="campo contenedor-file">
                            <input type="file" name="file" id="file" className="file" required onChange={ handleFileChange }/>
                            <button type='submit' className="btn btn-verde nvo-cliente btn-file">Enviar</button>
                        </div>
                    </form>
                </Fragment>
                : null
            }

            <ul className="listado-pedidos">
                {payments.map((payment) => {
                    return <Payment 
                        key={payment._id} 
                        payment={payment} 
                        reRender={reRender}
                    />
                })}
            </ul>
        </Fragment>
    )
}

export default Payments