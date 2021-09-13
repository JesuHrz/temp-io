import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)


export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: false
    }
  }
}

export default function PieChart ({ metrics }) {

  const data = {
    labels: ['Baja', 'Alta'],
    datasets: [
      {
        data: Object.values(metrics),
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  return <Doughnut options={options} data={data} />
}
