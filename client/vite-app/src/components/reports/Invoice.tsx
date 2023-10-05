import { useState, useEffect } from 'react'
import { useQuery } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import { Document, Page, Text, View, Image, Link, PDFViewer, StyleSheet } from "@react-pdf/renderer"
import moment from "moment"
import Swal from 'sweetalert2'
import { TRANSACTION_QUERIES } from "../../graphql/Transaction"
import LoadingSpinner from "../layout/loading-spinner/LoadingSpinner"
import logo from '../../../public/LogoOscuro.png'
import firma from '../../../public/firma.png'



const Invoice = () => {
    const { idTransaction } = useParams()
    const [transaction, setTransaction] = useState<{[key:string]: any}>({})
    const [rows, setRows] = useState<{[key:string]: any}[]>([])
    const navigate = useNavigate()
    const { loading, error, data } = useQuery(TRANSACTION_QUERIES.getOne, {
        variables: {
            idTransaction
        }
    })

    let labelType: string

    if (Object.keys(transaction).length > 0) labelType = transaction.tipo.includes('V') ? 'CLIENTE' : 'PROVEEDOR'

    const styles = StyleSheet.create({
        header: {
            padding: 10,
            marginBottom: 30,
            color: "#001028",
            fontSize: 12,
            display: "flex",
        },
        headerInfo: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20
        },
        body: {
            color: "#001028",
            fontSize: 12
        },
        logo: {
            alignSelf: "center",
            marginBottom: 10
        },
        logoImg: {
            width: 100
        },
        title: {
            borderTop: "1 solid #5D6975",
            borderBottom: "1 solid #5D6975",
            color: "#5D6975",
            fontSize: 30,
            fontWeight: "normal",
            marginBottom: 20,
            textAlign: "center",
            margin: "auto",
            paddingRight: "25%"
        },
        link: {
            color: "#5D6975",
            textDecoration: "underline"
        },
        projectSpan: {
            color: "#5D6975",
            width: 52,
            marginRight: 10,
            fontSize: 16
        },
        notice: {
            color: '#5D6975',
            fontSize: 17,
            marginLeft: 15,
            position: "absolute",
            bottom: 30,
            left: 0,
            right: 10
        },
        footer: {
            color: '#5D6975',
            width: "100%",
            borderTop: '1 solid #C1CED9',
            textAlign: 'center',
            paddingTop: 8,
            paddingBottom: 8,
            paddingRight: 15,
            paddingLeft: 15
        },
        rowView: {
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px solid #EEE',
            paddingTop: 8,
            paddingBottom: 8,
            textAlign: "center"
        },
        noticeText: {
            marginLeft: 15,
            marginBottom: 15
        },
        firmaImg: {
            width: 200
        },
        rowFirma: {
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 8,
            paddingBottom: 8,
            textAlign: "center"
        }
    })

    const column = [
        'CODIGO',
        'DESCRIPCION',
        'PRECIO',
        'CANTIDAD',
        'TOTAL'
    ]

    // Creando el mensaje de SweetAlert2
    const createMessage = (messageError) => {
        if (messageError) {
            const messageExtensions = messageError.graphQLErrors[0].extensions
            Swal.fire(
                messageError.message,
                messageExtensions.code,
                'error'
            )
            if(messageExtensions.code.includes('TOKEN')) navigate('/signin')
        }
    }

    useEffect(() => {
        createMessage(error)
        if (data && data.getOneTransaction) setTransaction(data.getOneTransaction)
    }, [error, data])

    useEffect(() => {
        const rows = []
        if(Object.keys(transaction).length > 0){
            for(const pedido of transaction.pedido){
                const { producto, cantidad } = pedido
                const precio = transaction.tipo.includes('V') ? producto.precio_venta : producto.precio_costo
                rows.push({
                    CODIGO: producto.codigo,
                    DESCRIPCION: producto.descripcion,
                    PRECIO: precio.toFixed(2),
                    CANTIDAD: cantidad,
                    TOTAL: (precio * cantidad).toFixed(2)
                })
            }
        }
        setRows(rows)
    }, [transaction])

    if (loading) return <LoadingSpinner />

    return (
        <PDFViewer style={{ width: "100%", height: "100%" }}>
            <Document>
                {   Object.keys(transaction).length > 0 ?
                    <Page size='A4'>
                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Image src={`${logo}`} style={styles.logoImg} />
                        </View>
                        <View style={styles.title}>
                            <Text>Factura</Text>
                            <Text>{transaction.codigo}</Text>
                        </View>
                        <View style={styles.headerInfo}>
                            <View>
                                <Text><Text style={styles.projectSpan}>{labelType}: </Text>{transaction.contacto.nombre}</Text>
                                {   transaction.contacto.direccion ?
                                    <Text><Text style={styles.projectSpan}>DIRECCION: </Text>{transaction.contacto.direccion}</Text>
                                    : null
                                }
                                <Text><Text style={styles.projectSpan}>EMAIL: </Text>
                                    <Link src={`mailto:${transaction.contacto.email}`} style={styles.link}>
                                        {transaction.contacto.email}
                                    </Link>
                                </Text>
                                <Text><Text style={styles.projectSpan}>FECHA: </Text>{moment(transaction.createdAt).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View>
                                <Text>GSP Solutions</Text>
                                <Text>Filas de Mariche</Text>
                                <Text>+58 4168314275</Text>
                                <View><Link src="mailto:company@example.com" style={styles.link}>company@example.com</Link></View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.body}>
                        {
                            <>
                                <View style={styles.rowView}>
                                    {
                                        column.map((columnData, index) => (
                                            <Text key={index} style={{ width: `${100 / column.length}%` }}>
                                                {columnData}
                                            </Text>
                                        ))
                                    }
                                </View>
                                {
                                    rows.map((rowData, index) => (
                                        <View key={index} style={styles.rowView}>
                                            {
                                                column.map((columnData) => (
                                                    <Text key={columnData} style={{ width: `${100 / column.length}%` }}>
                                                        {rowData[columnData]}
                                                    </Text>
                                                ))
                                            }
                                        </View>
                                    ))
                                }
                            </>
                        }
                        <View style={{ alignItems: "flex-end", }}>
                            <View style={styles.rowView}>
                                <Text style={{ width: `${100 / column.length}%` }}>TOTAL</Text>
                                <Text style={{ width: `${100 / column.length}%` }}>{transaction.total.toFixed(2)}</Text>
                            </View>
                            {/* <View style={styles.rowView}>
                                <Text style={{ width: `${100 / data.column.length}%` }}>TAX 25%</Text>
                                <Text style={{ width: `${100 / data.column.length}%` }}>$1,300.00</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={{ width: `${100 / data.column.length}%` }}>GRAND TOTAL</Text>
                                <Text style={{ width: `${100 / data.column.length}%` }}>$6,500.00</Text>
                            </View> */}
                        </View>
                    </View>
                    <View style={styles.notice}>
                        {   transaction.plazo > 0 ?
                            <View style={styles.noticeText}>
                                <Text>NOTA:</Text>
                                <Text>Debe cancelar esta factura antes de {transaction.plazo} dias.</Text>
                            </View>
                            : null
                        }
                        <View style={styles.footer}>
                            <View style={styles.rowFirma}>
                                <Text>FIRMA: </Text>
                                <Image src={`${firma}`} style={styles.firmaImg} />
                            </View>
                        </View>
                    </View>
                </Page>
                : null}
            </Document>
        </PDFViewer>
    )
}

export default Invoice