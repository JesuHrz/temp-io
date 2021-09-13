import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

import withSession from 'libs/session'
import { useInputValue } from 'hooks'

import SignInLayout from 'components/SiginInLayout'

import styles from 'styles/SignIn.module.css'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const API_URL = `${DOMAIN}/api/auth`

export default function SignIn () {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const email = useInputValue('')
  const password = useInputValue('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      email: email.value,
      password: password.value
    }

    try {
      setLoading(true)
      await axios.post(API_URL, data)
      router.push('/')
    } catch (error) {
      setLoading(false)
      // TODO: Show the error message correctly
      const { response } = error
      if (response && response.status === 401) {
        const message = response.data.error
        setErrorMessage(message)
      }
      console.error(error)
    }
  }

  return (
    <>
      <Head>
        <title>Inicio Sesión | TempIO</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SignInLayout
        title='Inicio Sesión'
        imageSrc='/poster.jpeg'
        imageAlt='Inicio Sesión Poster'
      >
        <form className={styles['signup__form']} onSubmit={handleSubmit}>
          <h1 className={styles['signup__title']}>Iniciar Sesión</h1>
          <p className={styles['signup__subtitle']}>Por favor, inicia sesíon para continuar</p>
          <div className={styles['signup__content']}>
            <input
              className={styles['signup__input']}
              type='text'
              required
              placeholder='Correo'
              {...email}
            />
            <input
              className={styles['signup__input']}
              type='password'
              required
              placeholder='Contraseña'
              {...password}
            />
            <input
              disabled={loading}
              className={styles['signup__submit']}
              type='submit'
              value='Acceder'
            />
            {
              errorMessage && (
                <span className={styles['signup__error']}>{errorMessage}</span>
              )
            }
            <span className={styles['signup__link']}>
              Aun no tienes una cuenta? {' '}
              <Link href='/sign-up'>
                <a>Registrate ya!</a>
              </Link>
            </span>
          </div>
        </form>
      </SignInLayout>
    </>
  )
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const token = req.session.get('token')

  if (token) {
    res.setHeader('location', '/')
    res.statusCode = 302
    res.end()
    return { 
      props: {}
    }
  }

  return {
    props: {}
  }
})
