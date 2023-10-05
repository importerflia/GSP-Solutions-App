import { Fragment, useState, useEffect } from "react"
import { ApolloError, useQuery } from "@apollo/client"
import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import StatusCard from "./status-card/StatusCard"
import Charts from "./charts/Charts"
import Table from "./table/Table"
import RadioState from "./RadioState"
import { TRANSACTION_QUERIES } from "../../graphql/Transaction"
import { chartInputData, contactInputData, contactsTableData, incomeBillChartData, productChartData, rangeInputData, statusCardsData, transactionInputData, transactionsTableData } from "../../lib/functions"

const getTransactionsByDateRange = (dateStart, dateEnd) => {
    const { error, data, refetch } = useQuery(TRANSACTION_QUERIES.getByDateRange, {
        variables: {
            dateStart,
            dateEnd
        }
    })

    if(error){
        return error
    }
    
    if (data && data.getTransactionsByDateRange){
        refetch()
        return data.getTransactionsByDateRange
    }
}

const Statistics = () => {
    // Estados
    const [range, setRange] = useState<any>('week')
    const [chartMode, setChartMode] = useState('ib')
    const [contactTransactionType, setContactTransactionType] = useState('V')
    const [transactionType, setTransactionType] = useState('V')
    const [cardsData, setCardsData] = useState([])
    const [lineChartData, setLineChartData] = useState<{[key:string]: any}>({})
    const [donutChartData, setDonutChartData] = useState<{[key:string]: any}>({})
    const [contactsData, setContactsData] = useState<{[key:string]: any}>({})
    const [transactionsData, setTransactionsData] = useState<{[key:string]: any}>({})

    const navigate = useNavigate()
    const contactLabelType = contactTransactionType === 'V' ? 'Clientes' : 'Proveedores'
    const conactType = contactTransactionType === 'V' ? 'C' : 'P'
    const transactionLabelType = transactionType === 'V' ? 'Ventas' : 'Compras' 

    let dateStart = moment().startOf(range).toISOString()
    let dateEnd = moment().endOf(range).toISOString()

    const queryData = getTransactionsByDateRange(dateStart, dateEnd)

    const handleChange = (e) => {
        setRange(e.target.value)
    }

    const handleModeChange = (e) => {
        setChartMode(e.target.value)
    }

    const handleContactChange = (e) => {
        setContactTransactionType(e.target.value)
    }

    const handleTransactionChange = (e) => {
        setTransactionType(e.target.value)
    }

    let rangeRadioData = rangeInputData(range ,handleChange)
    let chartRadioData = chartInputData(chartMode, handleModeChange)
    let contactRadioData = contactInputData(contactTransactionType, handleContactChange)
    let transactionRadioData = transactionInputData(transactionType, handleTransactionChange)

    useEffect(() => {
        if (queryData instanceof ApolloError){
            const code = queryData.graphQLErrors[0].extensions.code as string
            if (code.includes('TOKEN')) navigate('/signin')
        }
    }, [queryData])

    useEffect(() => {
        if (queryData instanceof ApolloError) return
        setCardsData(statusCardsData(queryData))
    }, [range, queryData])

    useEffect(() => {
        if (queryData instanceof ApolloError) return
        if(queryData) {
            if(chartMode === 'ib'){
                setLineChartData(incomeBillChartData(queryData, moment(dateStart), moment(dateEnd)))
            }else if(chartMode === 'prv'){
                setDonutChartData(productChartData(queryData, 'V'))
            }else if(chartMode === 'prc'){
                setDonutChartData(productChartData(queryData, 'C'))
            }
        }
    }, [chartMode, queryData])

    useEffect(() => {
        if (queryData instanceof ApolloError) return
        setContactsData(contactsTableData(queryData, contactTransactionType))
    }, [contactTransactionType, queryData])

    useEffect(() => {
        if (queryData instanceof ApolloError) return
        setTransactionsData(transactionsTableData(queryData, transactionType))
    }, [transactionType, queryData])

    const renderContactHead = (item, index) => (
        <th key={ index }>{ item }</th>
    )

    const renderContactBody = (item) => (
        <tr key={ item.contact._id }>
            <td>{ `${item.contact.nombre}, ${item.contact.documento}` }</td>
            <td>{ item.transactions }</td>
            <td>{ item.total.toFixed(2) }</td>
            <td>{ item.totalPaid.toFixed(2) }</td>
        </tr>
    )

    const renderTransactionHead = (item, index) => (
        <th key={ index }>{ item }</th>
    )

    const renderTransactionBody = (item) => (
        <tr key={ item.code }>
            <td>{ item.code }</td>
            <td>{ item.contact }</td>
            <td>{ item.total.toFixed(2) }</td>
            <td>{ item.totalPaid.toFixed(2) }</td>
            <td>{ moment(item.date).format('DD/MM/YYYY') }</td>
        </tr>
    )

    return(
        <Fragment>
            <div className="radio-states">
                <h2>Estadisticas</h2>
                <div className="radio-elements">
                    <h3 className="date-title">
                        { `Desde: ${moment(dateStart).format('DD/MM/YYYY')} - Hasta: ${moment(dateEnd).format('DD/MM/YYYY')}` }
                    </h3>
                    <form className="formulario">
                        <div className="radio">
                            {
                                rangeRadioData &&
                                rangeRadioData.map((input, index) => {
                                    return <RadioState key={index} input={ input } />
                                })
                            }
                        </div>
                    </form>
                </div>
            </div>  
            <div className="row" style={{ marginLeft: "5px" }}>
                <div className="col-6 col-sm-11 col-md-12">
                    <div className="row">
                        {
                            cardsData && cardsData.length > 0
                            ? cardsData.map((card) => {
                                return <StatusCard
                                    key={ card.title }
                                    card={ card }
                                />
                            })
                            : ''
                        }
                    </div>
                </div>
                <div className="col-6 col-sm-11 col-md-12">
                    <div className="card full-height">
                        <form className="formulario">
                            <div className="m-radio">
                            {
                                chartRadioData &&
                                chartRadioData.map((input, index) => {
                                    return <RadioState key={index} input={ input } />
                                })
                            }
                            </div>
                        </form>
                        <Charts 
                            lineChartData={ lineChartData } 
                            donutChartData={ donutChartData } 
                            chartMode={ chartMode } 
                            range={ range }
                        />
                    </div>
                </div>
                <div className="col-5 col-sm-11 col-md-12">
                    <div className="card">
                        <div className="card__header radio-states">
                            <h3>Mejores {`${contactLabelType}`}</h3>
                            <form className="formulario">
                                <div className="m-radio">
                                    {
                                        contactRadioData &&
                                        contactRadioData.map((input, index) => {
                                            return <RadioState key={index} input={ input } />
                                        })
                                    }
                                </div>
                            </form>
                        </div>
                        <div className="card__body">
                            <Table 
                                headData={ contactsData ? contactsData.headData : null }
                                renderHead={ renderContactHead }
                                bodyData={ contactsData ? contactsData.bodyData : null }
                                renderBody={ renderContactBody }
                            />
                        </div>
                        <div className="card__footer">
                            <Link to={`/contacts/${conactType}`}>Ver Todos</Link>
                        </div>
                    </div>
                </div>
                <div className="col-7 col-sm-11 col-md-12">
                    <div className="card">
                        <div className="card__header radio-states">
                            <h3>Ultimas { transactionLabelType }</h3>
                            <form className="formulario">
                                <div className="m-radio">
                                    {
                                        transactionRadioData &&
                                        transactionRadioData.map((input, index) => {
                                            return <RadioState key={ index } input={ input } />
                                        })
                                    }
                                </div>
                            </form>
                        </div>
                        <div className="card__body">
                            <Table 
                                headData={ transactionsData ? transactionsData.headData : null }
                                renderHead={ renderTransactionHead }
                                bodyData={ transactionsData ? transactionsData.bodyData : null }
                                renderBody={ renderTransactionBody }
                            />
                        </div>
                        <div className="card__footer">
                            <Link to={`/transactions/${transactionType}`}>Ver Todas</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Statistics