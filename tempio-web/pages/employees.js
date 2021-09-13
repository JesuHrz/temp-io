import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useFormik } from 'formik';

import Layout from 'components/Layout'

import withSession from 'libs/session'
import { decodeToken } from 'libs/jwt'
import { useSocket } from 'hooks'
import { employeesAtom, writeHasNotificationsAtom } from 'atoms'

import Modal from 'components/Modal'
import Table, { RowActions } from 'components/Table'
import Form, { FieldGroup, Submit } from 'components/Form'

import styles from '../styles/Employees.module.css'

const tableHeadings = [
  'IDENTIFICACION',
  'NOMBRES',
  'APELLIDOS',
  'FECHA DE NACIMIENTO',
  'CORREO',
  'TARJETA',
  'ULTIMA ACTUALIZACION',
  ''
]

const modalTitles = {
  add: 'Agregar Empleado',
  update: 'Editar Empleado',
  delete: 'Eliminar Empleado'
}

function handleParseData (data, { handleEdit, handleDelete } = {}) {
  return data.map(employee => {
    const {
      identification,
      name,
      lastName,
      born,
      email,
      cardId,
      updatedAt
    } = employee

    return {
      identification,
      name,
      lastName,
      born,
      email,
      cardId,
      updatedAt: format(new Date(updatedAt), 'Pp'),
      actions: <RowActions id={identification} onEdit={handleEdit} onDelete={handleDelete} />
    }
  })
}

function Employees ({ token, organization, data }) {
  useHydrateAtoms([[employeesAtom, data.employees]])
  const [employees, setEmployees] = useAtom(employeesAtom)
  const [_, setHasNotifications] = useAtom(writeHasNotificationsAtom)
  const [isOpen, setIsOpen] = useState(false)

  useSocket(organization.id, {
    onMessage: (topic, payload) => {
      switch (topic) {
        case 'agent/notification':
          setHasNotifications(true)
          break
        case 'card/read':
          if (payload) {
            formik.setFieldValue('cardId', payload)
          }
          break
      }
    }
  })

  const { setValues, ...formik } = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: 'add',
      idenfication: '',
      name: '',
      lastName: '',
      born: '',
      email: '',
      cardId: ''
    },
    onSubmit: values => {
      if (values.type === 'add') {
        axios.post('http://localhost:3001/api/employees', { ...values }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(({ data }) => {
            setEmployees(employees => [...employees, data.employee])
          })
          .catch(err => console.error(err))
      }
      if (values.type === 'update') {
        axios.put('http://localhost:3001/api/employees', { ...values }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(({ data }) => {
            const  employee = data.employee
            setEmployees(devices => devices.map(item => {
              if (item.identification === employee.identification) {
                return employee
              }
              return item
            }))
          })
          .catch(err => console.error(err))
      }
      if (values.type === 'delete') {
        axios.delete('http://localhost:3001/api/employees', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            id: values.identification
          }
        })
          .then(() => {
            setEmployees(employees => employees.filter(item => {
              return item.identification !== values.identification
            }))
          })
          .catch(err => console.error(err))
      }

      formik.setSubmitting(false)
      setIsOpen(false)
    }
  })

  const handleAdd = () => {
    formik.handleReset()
    setIsOpen(true)
  }

  const handleEdit = (id) => {
    const employee = employees.find(item => item.identification === id)
    setValues({ type: 'update', ...employee })
    setIsOpen(true)
  }

  const handleDelete = (id) => {
    setValues({ type: 'delete', identification: id })
    setIsOpen(true)
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

      <div className={styles['employees']}>
        <div className={styles['employees__add-wrapper']}>
          <a
            href='#'
            className={styles['employees__add']}
            onClick={handleAdd}
          >
            AGREGAR
          </a>
        </div>
        <Table
          headings={tableHeadings}
          data={handleParseData(employees,  { handleEdit, handleDelete })}
        />
        <Modal
          isOpen={isOpen}
          onRequestClose={() => {
            setIsOpen(false)
            formik.handleReset()
          }}
        >
          <Form
            onSubmit={formik.handleSubmit}
            className={styles['employees__form']}
            title={modalTitles[formik.values.type]}>
            {
              (formik.values.type === 'add' || formik.values.type === 'update') ? (
                <>
                  <FieldGroup
                    className={styles['employees__field']}
                    label='Identificion'
                    name='identification'
                    value={formik.values.identification}
                    disabled={formik.values.type === 'update'}
                    onChange={formik.handleChange}
                  />
                  <FieldGroup
                    className={styles['employees__field']}
                    label='name'
                    name='name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <FieldGroup
                    className={styles['employees__field']}
                    label='Apellido'
                    name='lastName'
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  <FieldGroup
                    className={styles['employees__field']}
                    label='Fecha de Nacimiento'
                    name='born'
                    value={formik.values.born}
                    onChange={formik.handleChange}
                  />
                  <FieldGroup
                    className={styles['employees__field']}
                    label='Correo'
                    name='email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  <FieldGroup
                    className={styles['employees__field']}
                    label='Tarjeta'
                    name='cardId'
                    disabled
                    value={formik.values.cardId}
                    onChange={formik.handleChange}
                  />
                  <div className={styles['employees__submit']}>
                    <Submit
                      disabled={formik.isSubmitting}
                      value={ formik.values.type === 'add' ? 'Agregar' : 'Actualizar' }
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className={styles['employees__alert']}>
                    ¿Estas seguro de deseas eliminar el empleado "{formik.values.identification}"?
                  </p>
                  <div className={styles['employees__submit']}>
                    <Submit
                      type='alert'
                      disabled={formik.isSubmitting}
                      value='Eliminar'
                    />
                  </div>
                </>
              )
            }
          </Form>
        </Modal>
      </div>
    </Layout>
  )
}

export default Employees

export const getServerSideProps = withSession(async function ({ req, res }) {
  const token = req.session.get('token')

  if (!token) {
    res.setHeader('location', '/sign-in')
    res.statusCode = 302
    res.end()

    return { props: {} }
  }

  try {
    const decodedToken = decodeToken(token)
    const { data } = await axios.get('http://localhost:3001/api/employees', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

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
