import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
// import styles from '../styles/Home.module.css'

import { useInputValue, useToken } from 'hooks'

export default function SignUp () {
  const [loading, setLoading] = useState(false)
  const organization = useInputValue('')
  const email = useInputValue('')
  const password = useInputValue('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const data = {
      organization: organization.value,
      email: email.value,
      password: password.value
    }

    try {
      setLoading(true)
      const result = await axios.post('http://localhost:3001/organization', data)
      setLoading(false)
      useToken(result.token)

      console.warn('result', result)      
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <Head>
        <title>Sign Up | TempIO</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <Col xs={12}>
            <h2 className='text-center'>Get Started Free</h2>
          </Col>
          <Col xs={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className='mb-3' controlId='formName'>
                <Form.Label>Nombre de la Organizacion</Form.Label>
                <Form.Control type='text' {...organization} />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formEmail'>
                <Form.Label>Correo electronico</Form.Label>
                <Form.Control type='email' {...email}/>
              </Form.Group>
              <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type='password' {...password} />
              </Form.Group>
              <Button
                className='full-width'
                variant='outline-primary'
                type='submit'
                disabled={loading}
              >
                Crear Organizacion
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </main>
  )
}
