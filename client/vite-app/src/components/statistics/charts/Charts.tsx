import IncomeBillsChart from "./IncomeBillsChart"
import ProductsChart from "./ProductsChart"

const Charts = (props) => {

    const { lineChartData, donutChartData, chartMode, range } = props

    const lineCondition = lineChartData 
    && chartMode === 'ib'
    && lineChartData.bills
    && lineChartData.incomes
    && lineChartData.bills.length > 0
    && lineChartData.incomes.length > 0
    && (lineChartData.bills.reduce((a, b) => a + b, 0) > 0 
    || lineChartData.incomes.reduce((a, b) => a + b, 0) > 0)

    const donutCondition = donutChartData 
    && (chartMode === 'prv' 
    || chartMode === 'prc')

    if (lineCondition){
        if (range === 'day' ){   
            return (
                <div style={{ textAlign: "center" }}>
                    <h4>Para ver el Grafico de Ganacias / Perdidas debe seleccionar desde una semana en adelante</h4>
                </div>
            )
        }
        return <IncomeBillsChart data={ lineChartData }/>
    
    }else if (range === 'day' && chartMode === 'ib'){   
        return (
            <div style={{ textAlign: "center" }}>
                <h4>Para ver el Grafico de Ganacias / Perdidas debe seleccionar desde una semana en adelante</h4>
            </div>
        )
    }else if (donutCondition){
        const donutChartLabelType = chartMode === 'prv' ? 'Mas Vendidos' : 'Mas Comprados'
        const donutChartLabelAction = chartMode === 'prv' ? 'vendido' : 'comprado'

        const productQuantity = donutChartData.productQuantity

        if ((productQuantity && productQuantity.length < 2)){
            return (
                <div style={{ textAlign: "center" }}>
                    <h4>
                        { 
                            `Para ver el Grafico de ${ donutChartLabelType } se deben haber 
                            ${ donutChartLabelAction } al menos 2 productos distintos` 
                        }
                    </h4>
                </div>
            )
        }

        return <ProductsChart data={ donutChartData } type={ chartMode }/>
    
    }else{
        return(
            <div style={{ textAlign: "center" }}>
                <h4>Para ver el Grafico deben existir transacciones en el periodo de tiempo seleccionado</h4>
            </div>
        )
    }
}

export default Charts