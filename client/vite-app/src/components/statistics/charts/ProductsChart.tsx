import { Doughnut } from 'react-chartjs-2'
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend 
} from 'chart.js'

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend
)

const ProductsChart = ({ data, type }) => {

    const { labels, productQuantity, backgroundColor, borderColor } = data
    const chartLabelType = type.includes('v') ? 'Vendidos' : 'Comprados'

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2
     }

    const chartData = {
        labels,
        datasets: [
            {
                label: chartLabelType,
                data: productQuantity,
                backgroundColor,
                borderColor,
                borderWidth: 1,
            },
        ],
    }

    return <Doughnut data={ chartData } options={ chartOptions }/>
}

export default ProductsChart