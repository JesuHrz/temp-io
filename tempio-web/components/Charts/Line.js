import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: false,
    }
  }
}

export default function LineChart ({ metrics }) {
  const labels = metrics.map(metric => metric.day)
  const data = {
    labels,
    datasets: [
      {
        label: 'Baja',
        data: metrics.map(metric => metric.low),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1
      },
      {
        label: 'Alta',
        data: metrics.map(metric => metric.high),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
      }
    ]
  }

  return <Line options={options} data={data} />
}
