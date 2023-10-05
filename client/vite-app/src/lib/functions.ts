import Swal from "sweetalert2"
import { FaShoppingBag, FaShippingFast, FaCoins, FaShoppingCart } from "react-icons/fa"
import moment from "moment"
import clienteAxios from "../config/axios"

export const massiveData = async (e, dataFile, uriCode, labelType, reRender, setFile) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', dataFile.file)
    const res = await clienteAxios.post(`/upload/${uriCode}`, formData, {
        headers: {
            'Content-Type': 'multipar/form-data'
        }
    })
    if (res.data.hasOwnProperty('apiCode')){
        Swal.fire(
            res.data.message,
            res.data.apiCode,
            'error'
        )
        dataFile.element.value = ''
        setFile({file: undefined, element: undefined})
    }else{
        Swal.fire(
            res.data.message,
            `Se agregaron ${ labelType } masivamente`,
            'success'
        )
        reRender()
        dataFile.element.value = ''
        setFile({file: undefined, element: undefined})
    }
}

export const statusCardsData = (queryData) => { 
    if (queryData){

        const sales = queryData.filter((transaction) => transaction.tipo.includes('V'))
        const purchases = queryData.filter((transaction) => transaction.tipo.includes('C'))

        const dataSales = {
            title: 'Ventas Totales',
            value: sales.length,
            icon: FaShoppingBag,
            to: '/transactions/V'
        }

        const dataPurchases = {
            title: 'Compras Totales',
            value: purchases.length,
            icon: FaShippingFast,
            to: '/transactions/C'
        }

        const dataIncome: {[key:string]: any} = {}

        if (sales){
            let incomes = 0
            for(const sale of sales){
                incomes += sale.cantidad_pagada
            }

            dataIncome.title = 'Ganancias'
            dataIncome.value = incomes.toFixed(2)
            dataIncome.icon = FaCoins
            dataIncome.to = '/transactions/V'
        }

        const dataBills: {[key:string]: any} = {}

        if (purchases){
            let bills = 0
            for(const purchase of purchases){
                bills += purchase.cantidad_pagada
            }

            dataBills.title = 'Gastos'
            dataBills.value = bills.toFixed(2)
            dataBills.icon = FaShoppingCart
            dataBills.to = '/transactions/C'
        }

        return [
            dataSales,
            dataPurchases,
            dataIncome,
            dataBills
        ]
    }
}

export const incomeBillChartData = (queryData, dateStart, dateEnd) => {
    const dateTime = moment.duration(dateEnd.diff(dateStart))
    const days = parseInt(dateTime.asDays().toFixed())
    let weeks, months
    
    if (days > 7 && days <= 31){
        weeks = parseInt(moment.duration(days, 'd').asWeeks().toFixed())
    }else if(days > 31){
        months = parseInt(moment.duration(days, 'd').asMonths().toFixed())
    }

    if (queryData){
        const incomes = []
        const bills = []
        const labels = []
        const index = months ? months : weeks ? weeks : days

        if (index === days){
            labels.push('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo')
        }else if (index === weeks){
            labels.push('Semana 1', 'Semana 2', 'Semana 3', 'Semana 4')
        }else if (index === months){
            labels.push('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre')
        }

        for (let i = 0; i < index; i++){
            const dateGroup = i + 1
            incomes[i] = 0
            bills[i] = 0
            let transaction, date, time
            for (let j = 0; j < queryData.length; j++) {
                transaction = queryData[j]
                date = moment(transaction.createdAt)
                time = months 
                ? date.toDate().getMonth() + 1 
                : weeks
                ? parseInt(((date.toDate().getDate() / 7)).toFixed()) 
                : date.toDate().getDay()

                if (time === dateGroup){
                    if (transaction.tipo.includes('V')){
                        incomes[i] += transaction.cantidad_pagada
                    }else if (transaction.tipo.includes('C')){
                        bills[i] += transaction.cantidad_pagada
                    }
                }
            }
        }
        return {incomes, bills, labels}
    }
}

export const productChartData = (queryData, type) => {
    if (queryData){
        const transactions = queryData.filter((transaction) => transaction.tipo.includes(type))
        const products = {}
        const products_value = []
        const products_label = []
        const backgroundColor = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(20, 131, 20, 0.2)',
            'rgba(160, 28, 72, 0.2)',
            'rgba(0, 72, 124, 0.2)',
            'rgba(112, 112, 112, 0.2)'
        ]

        const borderColor = [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(20, 131, 20)',
            'rgb(160, 28, 72)',
            'rgb(0, 72, 124)',
            'rgb(112, 112, 112)'
          ]

        for (let transaction of transactions){
            const pedidos = transaction.pedido
            if (pedidos){
                for (let pedido of pedidos){
                    if (Object.keys(products).length < 10){
                        products[pedido.producto.codigo] = 
                        Object.keys(products).includes(pedido.producto.codigo) 
                        ? products[pedido.producto.codigo]
                        : 0

                        products[pedido.producto.codigo] += pedido.cantidad
                    }
                }
            }
        }

        const productLen = Object.keys(products).length

        if (productLen > 0){
            for (const [key, value] of Object.entries(products)){
                products_label.push(key)
                products_value.push(value)
            }

            return {
                labels: products_label,
                productQuantity: products_value,
                backgroundColor: backgroundColor.slice(0, productLen),
                borderColor: borderColor.slice(0, productLen)
            }
        }
    }
}

export const contactsTableData = (queryData, type) => {
    const contactLabel = type === 'V' ? 'Cliente' : 'Proveedor'
    const transactionLabel = type === 'V' ? 'Ventas' : 'Compras'
    const actionLable = type === 'V' ? 'Vendido' : 'Comprado'
    if (queryData) {
        const transactions = queryData.filter((transaction) => transaction.tipo.includes(type))
        const headData = [contactLabel, `# ${transactionLabel}`, `Total ${actionLable}`, 'Total Pagado']
        const contactDiscarted = []
        const contactsData = []

        for (let transaction of transactions){
            const contactId = transaction.contacto._id
            let contactTotalTransactions = 0
            let contactTotal = 0
            let contactTotalPaid = 0
            if (!contactDiscarted.includes(contactId) && contactsData.length < 5){
                const contactTransactions = transactions.filter((transaction) => transaction.contacto._id == contactId)
                contactTransactions.forEach((transaction) => {
                    contactTotal += transaction.total
                    contactTotalPaid += transaction.cantidad_pagada
                    contactTotalTransactions += 1
                })
                contactDiscarted.push(contactId)
                contactsData.push(
                    {
                        contact: transaction.contacto,
                        transactions: contactTotalTransactions,
                        total: contactTotal,
                        totalPaid: contactTotalPaid
                    }
                )
            }
        }

        contactsData.sort((x, y) => y.total - x.total)

        return {
            headData,
            bodyData: contactsData,
        }
    }
}

export const transactionsTableData = (queryData, type) => {
    const transactionLabel = type === 'V' ? 'Ventas' : 'Compras'
    const contactLabel = type === 'V' ? 'Cliente' : 'Proveedor'
    if (queryData) {
        const headData = [transactionLabel, `${contactLabel}`, 'Total', 'Total Pagado', 'Fecha']
        const transactionsData = []
        const transactions = queryData
        .filter((transaction) => transaction.tipo.includes(type))
        .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))

        for (let transaction of transactions){
            if (transactionsData.length < 5){
                transactionsData.push(
                    {
                        code: transaction.codigo,
                        contact: `${transaction.contacto.nombre}, ${transaction.contacto.documento}`,
                        total: transaction.total,
                        totalPaid: transaction.cantidad_pagada,
                        date: transaction.createdAt
                    }
                )
            }
        }

        return {
            headData,
            bodyData: transactionsData,
        }
    }
}

export const rangeInputData = (state, handleChange) => {
    return [ 
        {
            id: 'day',
            value: 'day',
            label: 'Hoy',
            name: 'range-time',
            handle: handleChange,
            state
        },
        {
            id: 'week',
            value: 'week',
            label: 'Semana',
            name: 'range-time',
            handle: handleChange,
            state
        },
        {
            id: 'month',
            value: 'month',
            label: 'Mes',
            name: 'range-time',
            handle: handleChange,
            state
        },
        {
            id: 'year',
            value: 'year',
            label: 'Año',
            name: 'range-time',
            handle: handleChange,
            state
        }
    ]
}

export const chartInputData = (state, handleChange) => {
    return [
        {
            id: 'ib',
            value: 'ib',
            label: 'Ganancias / Perdidas',
            name: 'chart-mode',
            handle: handleChange,
            state
        },
        {
            id: 'prv',
            value: 'prv',
            label: 'Mas Vendido',
            name: 'chart-mode',
            handle: handleChange,
            state
        },
        {
            id: 'prc',
            value: 'prc',
            label: 'Mas Comprado',
            name: 'chart-mode',
            handle: handleChange,
            state
        }
    ]
}

export const contactInputData = (state, handleChange) => {
    return [
        {
            id: 'C',
            value: 'V',
            label: 'Clientes',
            name: 'contact-type',
            handle: handleChange,
            state
        },
        {
            id: 'P',
            value: 'C',
            label: 'Proveedores',
            name: 'contact-type',
            handle: handleChange,
            state
        }
    ]
}

export const transactionInputData = (state, handleChange) => {
    return [
        {
            id: 'TV',
            value: 'V',
            label: 'Ventas',
            name: 'transaction-type',
            handle: handleChange,
            state
        },
        {
            id: 'TC',
            value: 'C',
            label: 'Compras',
            name: 'transaction-type',
            handle: handleChange,
            state
        }
    ]
}