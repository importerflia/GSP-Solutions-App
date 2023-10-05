const ProductTransaction = ({ pedido, type }) => {
    const { producto, cantidad } = pedido  
    const productPriceType = type === 'V' ? producto.precio_venta : producto.precio_costo

    return (
        <li>
            <p>{ producto.codigo }</p>
            <p>Precio: { productPriceType.toFixed(2) }</p>
            <p>Cantidad: { cantidad }</p>
        </li>
    )
}

export default ProductTransaction