import { useQuery } from "@apollo/client"
import { Fragment, useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import Product from "./Product"
import { FaPlusCircle } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PRODUCT_QUERIES } from "../../graphql/Product"
import { AuthContext } from "../../context/authContext"
import { massiveData } from "../../lib/functions"

const Products = () => {
    const { loading, error, data, refetch } = useQuery(PRODUCT_QUERIES.get)
    const [products, setProducts] = useState([])
    const [dataFile, setFile] = useState({file: undefined, element: undefined})
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const reRender = () => {
        refetch()
        if (data) setProducts(data.getProducts)
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

    return (
        <Fragment>
            <h2>Productos</h2>

            {   context.isModerator
                ? <Fragment>
                    <Link to="/products/new" className="btn btn-verde nvo-cliente">
                        <i><FaPlusCircle/></i>
                        Nuevo Producto
                    </Link>

                    <form onSubmit={ (e) => massiveData(e, dataFile, 'PR', 'productos', reRender, setFile) }>
                        <div className="campo contenedor-file" style={{display: "flex"}}>
                            <input type="file" name="file" id="file" className="file" required onChange={ handleFileChange }/>
                            <button type='submit' className="btn btn-verde nvo-cliente btn-file">Enviar</button>
                        </div>
                    </form>
                </Fragment>
                : null
            }

            <ul className="listado-productos">
                {products.map(product => {
                    return <Product product={product} key={product._id} reRender={reRender}/>
                })}
            </ul>
        </Fragment>
    )
}

export default Products