import { FaMinus, FaMinusCircle, FaPlus } from "react-icons/fa"

const FormQuantityProduct = (props) => {

    const { type, product, addProduct, decreaseProduct, index, handleQuantityChange, deleteProduct } = props
    const update = props.hasOwnProperty('update') ? true : false
    const producto = !update ? product : product.producto
    const productPrice = type === 'V' ? producto.precio_venta.toFixed(2) : producto.precio_costo.toFixed(2)

    return(
        <li>
            <div className="texto-producto">
                <p className="nombre">{ producto.codigo }</p>
                <p className="precio">{ productPrice }</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                    <i className="btn-minus" onClick={ () => decreaseProduct(index) }>
                        <FaMinus/>
                    </i>
                    
                    <input 
                        type="number" 
                        name="cantidad" 
                        style={{textAlign: "center"}} 
                        value={product.cantidad ?? ''} 
                        onChange={ (e) => handleQuantityChange(e, index) }
                    />

                    <i className="btn-plus" onClick={ () => addProduct(index)}>
                        <FaPlus/>
                    </i>
                </div>
                <button type="button" className="btn btn-rojo" onClick={ () => deleteProduct(producto._id ?? producto.producto) }>
                    <i><FaMinusCircle/></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    )
}

export default FormQuantityProduct
