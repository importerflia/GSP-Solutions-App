import { useMutation } from "@apollo/client"
import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { FaPenAlt, FaTimes } from "react-icons/fa"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import { PRODUCT_MUTATIONS } from "../../graphql/Product"
import { AuthContext } from "../../context/authContext"

const Product = ({ product, reRender }) => {
    const [deleteProduct, { loading, error, data }] = useMutation(PRODUCT_MUTATIONS.delete)
    const { _id, codigo, tipo, descripcion, precio_costo, precio_venta, cantidad } = product
    const context = useContext(AuthContext)
    const navigate = useNavigate()

    const handleClick = (idProduct) => {
        Swal.fire({
            title: 'Esta seguro?',
            text: "No podra revertir los cambios!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct({ variables: {
                    idProduct: idProduct
                }})
                if (!error){
                    Swal.fire(
                        'Producto Eliminado!',
                        `Se elimino el producto con el codigo: ${codigo}.`,
                        'success'
                    )
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
        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{ codigo }</p>
                { tipo ? <p className="precio">Tipo: { tipo }</p>: '' }
                { descripcion ? <p className="precio">Descripcion: { descripcion }</p>: '' }
                <p className="precio">Precio Costo: { precio_costo.toFixed(2) }</p>
                <p className="precio">Precio Venta: { precio_venta.toFixed(2) }</p>
                <p className="precio">Cantidad: { cantidad }</p>
            </div>

            {   context.isModerator
                ? <div className="acciones">
                    <Link to={ `/products/edit/${_id}` } className="btn btn-azul">
                        <i><FaPenAlt/></i>
                        Editar Producto
                    </Link>

                    <button type="button" className="btn btn-rojo btn-eliminar" onClick={ () => handleClick(_id) }>
                        <i><FaTimes/></i>
                        Eliminar Producto
                    </button>
                </div>
                : null
            }
        </li>
    )
}

export default Product