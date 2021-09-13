// import mqtt from 'mqtt'
// import { useEffect, useState } from 'react'
import Head from 'next/head'

import Layout from 'components/Layout'

import withSession from 'libs/session'

import styles from '../styles/Home.module.css'

function Home (props) {
  return (
    <Layout title='Dashboard'>
      <Head>
        <title>Dashboard | TempIO</title>
        <meta name="description" content="TempIO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles['dashboard']}>
        HOLA
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

  return {
    props: {
      token
    }
  }
})

// const client = mqtt.connect('ws://localhost:3001', {
  //   clientId: 'organization:1',
  // })

  // const TOPIC = 'organization:1'

  // client.on('message', function(topic, message) {
  //   console.warn('topic', topic, 'message', message.toString())
  // })

  // client.on('connect', () => {
  //   console.warn('connected')
  //   client.subscribe(TOPIC)

    // client.on('error', error => {
    //   console.warn('ERROR: ', error);
    // });

    // client.on('offline', () => {
    //   console.warn('offline');
    // });

    // client.on('disconnect', () => {
    //   console.warn('disconnect');
    // });

    // client.on('reconnect', () => {
    //   console.warn('reconnect');
    // })
  // })
