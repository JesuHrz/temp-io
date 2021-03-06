import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

import withSession from 'libs/session'
import { useInputValue } from 'hooks'

import SignInLayout from 'components/SiginInLayout'

import styles from 'styles/SignIn.module.css'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const API_URL = `${DOMAIN}/api`

export default function SignUp () {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const organization = useInputValue('')
  const email = useInputValue('')
  const password = useInputValue('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = `${API_URL}/sign-up`
    const data = {
      organization: organization.value,
      email: email.value,
      password: password.value
    }

    try {
      setLoading(true)
      await axios.post(url, data)
      setLoading(false)
      router.push('/')
    } catch (error) {
      setLoading(false)
      // TODO: Show the error message correctly
      console.error(error.response)
    }
  }

  return (
    <>
      <Head>
        <title>Registrate | TempIO</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SignInLayout
        imageSrc='/poster.jpeg'
        imageAlt='Registrate Poster'
      >
        <form className={styles['signup__form']} onSubmit={handleSubmit}>
          <h1 className={styles['signup__title']}>Registrar</h1>
          <p className={styles['signup__subtitle']}>Por favor, registrate para continuar</p>
          <div className={styles['signup__content']}>
            <input
              className={styles['signup__input']}
              type='text'
              required
              placeholder='Nombre de la organizacion'
              {...organization}
            />
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
              placeholder='Contrase??a'
              {...password}
            />
            <input
              className={styles['signup__submit']}
              disabled={loading}
              type='submit'
              value='Registrar'
            />
            <span className={styles['signup__link']}>
              Ya tienes una cuenta? {' '}
              <Link href='/sign-in'>
                <a>Iniciar sesi??n</a>
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
