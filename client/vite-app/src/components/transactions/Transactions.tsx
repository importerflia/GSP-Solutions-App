import { useEffect, useState, Fragment, useContext } from "react"
import { useQuery } from "@apollo/client"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import Transaction from "./Transaction"
import { FaPlusCircle } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { TRANSACTION_QUERIES } from "../../graphql/Transaction"
import { AuthContext } from "../../context/authContext"


const Transactions = () => {
    const { type } = useParams()
    const transactionLabelType = type === 'V' ? 'Venta' : 'Compra'
    const { loading, error, data, refetch } = useQuery(TRANSACTION_QUERIES.get)
    const [transactions, setTransactions] = useState([])
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const reRender = () => {
        refetch()
        if (data) setTransactions(data.getTransactions)
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
            <h2>{ transactionLabelType }s</h2>

            {   context.isModerator
                ? <Link to={`/transactions/${type}/new`} className="btn btn-verde nvo-cliente">
                    <i><FaPlusCircle/></i>
                    Nuevo { transactionLabelType }
                </Link>
                : null
            }

            <ul className="listado-pedidos">
                {transactions.map((transaction) => {
                    if (transaction.tipo.includes(type)){
                        return <Transaction 
                            key={transaction._id} 
                            transaction={transaction} 
                            reRender={reRender} 
                            type={type} 
                        />
                    }
                })}
            </ul>
        </Fragment>
    )
}

export default Transactions