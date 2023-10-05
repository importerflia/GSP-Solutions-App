import { useEffect } from "react"
import { useQuery } from "@apollo/client"
import Swal from "sweetalert2"
import Select from "react-select"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PRODUCT_QUERIES } from "../../graphql/Product"

const FormSearchProduct = ({ handleProductChange }) => {
    const { loading, error, data } = useQuery(PRODUCT_QUERIES.get)
    const navigate = useNavigate()

    let productOptions = []

    if (data && data.getProducts) {
        data.getProducts.forEach((product) => {
            productOptions.push({
                value: product._id,
                label: `${product.codigo}`
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
        <form>
            <legend>Selecciona un Producto</legend>
            <div style={{ padding: ".5rem 2rem", marginBottom: "2rem" }}>
                <Select
                    options={ productOptions }
                    isClearable
                    backspaceRemovesValue
                    placeholder='Agregue un producto'
                    onChange={ (e) => handleProductChange(e, data) }
                />
            </div>
        </form>
    )
}

export default FormSearchProduct