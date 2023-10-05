import logo from '../../assets/images/logo.png'
import { Document, Page, Text, View, Image, Link, PDFViewer, StyleSheet } from '@react-pdf/renderer'

const ExampleReport = () => {
    const data = {
        column: [
            'CODIGO',
            'DESCRIPCION',
            'PRECIO',
            'CANTIDAD',
            'TOTAL'
        ],
        data: [
            {
                CODIGO: 'Design',
                DESCRIPCION: "Creating a recognizable design solution based on the company's existing visual identity",
                PRECIO: '$40.00',
                CANTIDAD: '26',
                TOTAL: '1040.00'
            },
            {
                CODIGO: 'Development',
                DESCRIPCION: "Developing a Content Management System-based Website",
                PRECIO: '$40.00',
                CANTIDAD: '80',
                TOTAL: '$3,200.00'
            },
            {
                CODIGO: 'Training',
                DESCRIPCION: "Initial training sessions for staff responsible for uploading web content",
                PRECIO: '$40.00',
                CANTIDAD: '4',
                TOTAL: '$160.00'
            },
            {
                CODIGO: 'Training',
                DESCRIPCION: "Initial training sessions for staff responsible for uploading web content",
                PRECIO: '$40.00',
                CANTIDAD: '4',
                TOTAL: '$160.00'
            },
        ]
    }

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
            justifyContent: "space-between"
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
            width: 90
        },
        title: {
            borderTop: "1 solid #5D6975",
            borderBottom: "1 solid #5D6975",
            color: "#5D6975",
            fontSize: 40,
            fontWeight: "normal",
            margin: "auto",
            marginBottom: 20
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
            marginBottom: 15,
            marginTop: 15
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
        }

    })

    return (
        <PDFViewer style={{ width: "100%", height: "100%" }}>
            <Document>
                <Page size='A4'>
                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Image src={`${logo}`} style={styles.logoImg} />
                        </View>
                        <Text style={styles.title}>INVOICE 3-2-1</Text>
                        <View style={styles.headerInfo}>
                            <View>
                                <Text><Text style={styles.projectSpan}>CLIENT</Text> John Doe</Text>
                                <Text><Text style={styles.projectSpan}>ADDRESS</Text> 796 Silver Harbour, TX 79273, US</Text>
                                <Text><Text style={styles.projectSpan}>EMAIL</Text> <Link src="mailto:john@example.com" style={styles.link}>john@example.com</Link></Text>
                                <Text><Text style={styles.projectSpan}>DATE</Text> August 17, 2015</Text>
                                <Text><Text style={styles.projectSpan}>DUE DATE</Text> September 17, 2015</Text>
                            </View>
                            <View>
                                <Text>Company Name</Text>
                                <Text>455 Foggy Heights, AZ 85004, US</Text>
                                <Text>(602) 519-0450</Text>
                                <View><Link src="mailto:company@example.com" style={styles.link}>company@example.com</Link></View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.body}>
                        {
                            <>
                                <View style={styles.rowView}>
                                    {
                                        data.column.map((columnData) => (
                                            <Text style={{ width: `${100 / data.column.length}%` }}>
                                                {columnData}
                                            </Text>
                                        ))
                                    }
                                </View>
                                {
                                    data.data.map((rowData) => (
                                        <View style={styles.rowView}>
                                            {
                                                data.column.map((columnData) => (
                                                    <Text style={{ width: `${100 / data.column.length}%` }}>
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
                                <Text style={{ width: `${100 / data.column.length}%` }}>SUBTOTAL</Text>
                                <Text style={{ width: `${100 / data.column.length}%` }}>$5,200.00</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={{ width: `${100 / data.column.length}%` }}>TAX 25%</Text>
                                <Text style={{ width: `${100 / data.column.length}%` }}>$1,300.00</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={{ width: `${100 / data.column.length}%` }}>GRAND TOTAL</Text>
                                <Text style={{ width: `${100 / data.column.length}%` }}>$6,500.00</Text>
                            </View>
                        </View>
                        <View style={styles.notice}>
                            <Text>NOTICE:</Text>
                            <Text>A finance charge of 1.5% will be made on unpaid balances after 30 days.</Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text>Invoice was created on a computer and is valid without the signature and seal.</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}

export default ExampleReport