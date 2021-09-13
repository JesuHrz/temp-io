import { useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'
import { useHydrateAtoms } from 'jotai/utils'
import { useAtom } from 'jotai'
import { format } from 'date-fns'

import Layout from 'components/Layout'
import Table from 'components/Table'

import { useSocket } from 'hooks'
import withSession from 'libs/session'
import { decodeToken } from 'libs/jwt'
import { notificationsAtom, writeHasNotificationsAtom } from 'atoms'

import styles from 'styles/Notifications.module.css'

const tableHeadings = [
  'ID',
  'DISPOSITIVO',
  'EMPLEADO',
  'DESCRIPCION',
  'FECHA'
]

function handleParseData (data) {
  return data.map(item => {
    return {
      ...item,
      createdAt: format(new Date(item.createdAt), 'Pp'),
    }
  })
}

function Devices ({ organization, data = [], token}) {
  useHydrateAtoms([[notificationsAtom, data]])
  const [notifications, setNotificationsAtom] = useAtom(notificationsAtom)
  const [_, setHasNotifications] = useAtom(writeHasNotificationsAtom)

  useSocket(organization.id, {
    onMessage: (topic, payload) => {
      switch (topic) {
        case 'agent/notification':
          const notification = {
            id: payload.id,
            agentId: payload.agentId,
            employeeId: payload.employeeId,
            description: payload.description,
            createdAt: payload.createdAt
          }
          setNotificationsAtom(prev => handleParseData([notification, ...prev]))
          setHasNotifications(false)
          break
      }
    }
  })

  useEffect(async () => {
    try {
      setHasNotifications(false)
      await axios.post('http://localhost:3001/api/notifications/read', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <Layout
      title='Notificaciónes'
      userName={organization.name}
    >
      <Head>
        <title>Notificaciónes | TempIO</title>
        <meta name='description' content='TempIO' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles['notifications']}>
        <Table
          headings={tableHeadings}
          data={handleParseData(notifications)}
        />
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
    const { data } = await axios.get('http://localhost:3001/api/notifications', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const decodedToken = decodeToken(token)

    return {
      props: {
        token,
        organization: decodedToken,
        data: data.notifications
      }
    }
  } catch (error) {
    return { props: {} }
  }
})
