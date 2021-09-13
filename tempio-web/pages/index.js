import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAtom } from 'jotai'
import axios from 'axios'

import Layout from 'components/Layout'

import withSession from 'libs/session'
import { decodeToken } from 'libs/jwt'
import { useSocket } from 'hooks'
import { writeHasNotificationsAtom } from 'atoms'

import { Pie, Line } from 'components/Charts'

import styles from '../styles/Home.module.css'

function Home ({ organization, data, token }) {
  const [pieChart, setPieChart] = useState({})
  const [lineChart, setLineChart] = useState([])
  const [total, setTotal] = useState(0)
  const [_, setHasNotifications] = useAtom(writeHasNotificationsAtom)

  useSocket(organization.id, {
    onMessage: (topic) => {
      switch (topic) {
        case 'agent/notification':
          setHasNotifications(true)
          break
      }
    }
  })

  useEffect(() => {
    setDataChart(data)
  }, [])

  const updateMetrics = async () => {
    const { data } = await axios.get('http://localhost:3001/api/metrics', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setDataChart(data)
  }

  const setDataChart = ({ pie, line }) => {
    setPieChart(pie)
    setLineChart(line)
    setTotal(() => parseInt(pie?.low) + parseInt(pie?.high))
  }

  return (
    <Layout
      title='Dashboard'
      userName={organization.name}
    >
      <Head>
        <title>Dashboard | TempIO</title>
        <meta name="description" content="TempIO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles['dashboard']}>
        <div className={styles['dashboard__action-wrapper']}>
          <a
            href='#'
            className={styles['dashboard__action']}
            onClick={updateMetrics}
          >
            ACTUALIZAR
          </a>
        </div>
        <div className={styles['dashboard__porcentage']}>
          <p className={styles['dashboard__porcentage-icon']}>
            <span className={'material-icons-outlined'}>thermostat_auto</span>
          </p>
          <span className={styles['dashboard__porcentage-total']}>{total}</span>
          <p className={styles['dashboard__porcentage-title']}>
            Total de temperaturas del mes
          </p>
        </div>
        <div className={styles['dashboard__pie']}>
          <p className={styles['dashboard__metric-title']}>Temperaturas tomadas del mes</p>
          <Pie metrics={pieChart} />
        </div>
        <div className={styles['dashboard__line']}>
          <p className={styles['dashboard__metric-title']}>Temperaturas tomadas de D/m</p>
          <Line metrics={lineChart} />
        </div>
      </div>
    </Layout>
  )
}

export default Home

export const getServerSideProps = withSession(async function ({ req, res }) {
  const token = req.session.get('token')

  if (!token) {
    res.setHeader('location', '/sign-in')
    res.statusCode = 302
    res.end()

    return { props: {} }
  }

  try {
    const { data } = await axios.get('http://localhost:3001/api/metrics', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const decodedToken = decodeToken(token)

    return {
      props: {
        token,
        organization: decodedToken,
        data
      }
    }
  } catch (error) {
    return { props: {} }
  }
})
