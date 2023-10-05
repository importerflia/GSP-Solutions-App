const TransactionPayment = ({ transaction, type }) => {
    const { codigo, cantidad_pagada, total, contacto } = transaction
    const contactLabelType = type.includes('V') ? 'Cliente' : 'Proveedor'

    return (
        <li>
            <p>Codigo: { codigo }</p>
            <p>{ contactLabelType }: { contacto.nombre }, { contacto.documento }</p>
            <p>Cantidad Pagada: { cantidad_pagada.toFixed(2) }</p>
            <p>Total: { total.toFixed(2) }</p>
        </li>
    )
}

export default TransactionPayment