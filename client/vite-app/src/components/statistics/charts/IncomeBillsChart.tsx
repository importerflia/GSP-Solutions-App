import { Line } from "react-chartjs-2"

import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
 } from "chart.js"

 ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
 )

const IncomeBillsChart = ({ data }) => {

   const { incomes, bills, labels } = data

   const chartOptions = {
      fill: true,
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      scales: {
         y: {
            min: 0
         }
      }
   }

   const chartData = {
      labels,
      datasets: [
         {
            label: 'Ganacias',
            data: incomes,
            tension: 0.5,
            borderColor: 'rgb(20, 131, 20)',
            pointRadius: 3,
            pointBackgroundColor: 'rgb(20, 131, 20)',
            backgroundColor: 'rgba(20, 131, 20, 0.2)'
         },
         {
            label: 'Gastos',
            data: bills,
            tension: 0.5,
            borderColor: 'rgb(160, 28, 72)',
            pointRadius: 3,
            pointBackgroundColor: 'rgb(160, 28, 72)',
            backgroundColor: 'rgba(160, 28, 72, 0.2)'
         },
      ]
   }

   return <Line data={ chartData } options={ chartOptions }/>
}

export default IncomeBillsChart