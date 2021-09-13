import Head from 'next/head'
import axios from 'axios'

import Layout from 'components/Layout'

import withSession from 'libs/session'

import styles from '../styles/Devices.module.css'

function Devices (props) {
  console.warn('props', props)
  return (
    <Layout title='Devices'>
      <Head>
        <title>Devices | TempIO</title>
        <meta name="description" content="TempIO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles['devices']}>
        Devices
      </div>
    </Layout>
  )
}

export default Devices

export const getServerSideProps = withSession(async function ({ req, res }) {
  const token = req.session.get('token')

  if (!token) {
    res.setHeader('location', '/sign-in')
    res.statusCode = 302
    res.end()

    return { props: {} }
  }

  try {
    const { data } = await axios.get('http://localhost:3001/api/devices', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return {
      props: {
        data: data?.devices
      }
    }
  } catch (error) {
    return { props: {} }
  }
})
