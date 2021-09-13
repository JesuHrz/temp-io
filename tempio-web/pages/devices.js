
import { useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import { format } from 'date-fns'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useFormik } from 'formik';

import Layout from 'components/Layout'
import Table, { RowActions } from 'components/Table'
import Led from 'components/Led'
import Modal from 'components/Modal'
import Form, { FieldGroup, Submit } from 'components/Form'

import { useSocket } from 'hooks'
import { devicesAtom, writeHasNotificationsAtom } from 'atoms'
import withSession from 'libs/session'
import { decodeToken } from 'libs/jwt'

import styles from 'styles/Devices.module.css'

const tableHeadings = [
  'ID',
  'DISPOSITIVO',
  'ESTADO',
  'FECHA DE CREACION',
  'ULTIMA ACTUALIZACION',
  ''
]

const modalTitles = {
  add: 'Agregar Dispositivo',
  update: 'Editar Dispositivo',
  delete: 'Eliminar Dispositivo'
}

function handleParseData (data, { handleEdit, handleDelete } = {}) {
  return data.map(item => {
    const { agentId, name, status, createdAt, updatedAt } = item
    return {
      id: agentId,
      name,
      status: <Led className={styles['devices__led']} status={status} />,
      createdAt: format(new Date(createdAt), 'Pp'),
      updatedAt: format(new Date(updatedAt), 'Pp'),
      actions: <RowActions id={agentId} onEdit={handleEdit} onDelete={handleDelete} />
    }
  })
}

function handleParseDevices (data, payload) {
  return data.map(item => {
    if (item.agentId === payload.agentId) {
      item.status = payload.status
    }
    return item
  })
}

function Devices ({ organization, data = [], token }) {
  useHydrateAtoms([[devicesAtom, data]])
  const [devices, setDevices] = useAtom(devicesAtom)
  const [_, setHasNotifications] = useAtom(writeHasNotificationsAtom)
  const [isOpen, setIsOpen] = useState(false)
  const { setValues, ...formik } = useFormik({
    initialValues: {
      type: 'add',
      name: '',
      agentId: ''
    },
    onSubmit: values => {
      if (values.type === 'add') {
        axios.post('http://localhost:3001/api/devices', {
          name: values.name,
          agentId: values.agentId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(({ data }) => {
            setDevices(devices => [...devices, data.agent])
          })
      }
      if (values.type === 'update') {
        axios.put('http://localhost:3001/api/devices', {
          name: values.name,
          agentId: values.agentId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(({ data }) => {
            setDevices(devices => devices.map(item => {
              if (item.agentId === data.agent.agentId) {
                return data.agent
              }
              return item
            }))
          })
      }
      if (values.type === 'delete') {
        axios.delete('http://localhost:3001/api/devices', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            agentId: values.agentId
          }
        })
          .then(() => {
            setDevices(devices => devices.filter(item => {
              return item.agentId !== values.agentId
            }))
          })
      }

      formik.setSubmitting(false)
      setIsOpen(false)
    }
  })

  useSocket(organization.id, {
    onMessage: (topic, payload) => {
      switch (topic) {
        case 'agent/connected':
          setDevices(devices => handleParseDevices(devices, payload))
          break
        case 'agent/notification':
          setHasNotifications(true)
          break
      }
    }
  })

  const handleAdd = () => {
    setValues({ type: 'add', name: '', agentId: '' })
    setIsOpen(true)
  }

  const handleEdit = async (id) => {
    const device = devices.find(item => item.agentId === id)
    setValues({ type: 'update', name: device.name, agentId: id })
    setIsOpen(true)
  }

  const handleDelete = async (id) => {
    setValues({ type: 'delete', agentId: id })
    setIsOpen(true)
  }

  return (
    <Layout
      title='Dispositivos'
      userName={organization.name}
    >
      <Head>
        <title>Devices | TempIO</title>
        <meta name='description' content='TempIO' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles['devices']}>
        <div className={styles['devices__add-wrapper']}>
          <a
            href='#'
            className={styles['devices__add']}
            onClick={handleAdd}
          >
            AGREGAR
          </a>
        </div>

        <Table
          headings={tableHeadings}
          data={handleParseData(devices, { handleEdit, handleDelete })}
        />
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
        >
          <Form
            onSubmit={formik.handleSubmit}
            className={styles['devices__form']}
            title={modalTitles[formik.values.type]}>
            {
              (formik.values.type === 'add' || formik.values.type === 'update') ? (
                <>
                  <FieldGroup
                    className={styles['devices__field']}
                    label='Nombre del Dispositivo'
                    name='name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <FieldGroup
                    className={styles['devices__field']}
                    label='ID del Dispositivo'
                    name='agentId'
                    disabled={formik.values.type === 'update'}
                    value={formik.values.agentId}
                    onChange={formik.handleChange}
                  />
                  <div className={styles['devices__submit']}>
                    <Submit
                      disabled={formik.isSubmitting}
                      value={ formik.values.type === 'add' ? 'Agregar' : 'Actualizar' }
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className={styles['devices__alert']}>
                    ¿Estas seguro de deseas eliminar el dispositivo "{formik.values.agentId}"?
                  </p>
                  <div className={styles['devices__submit']}>
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

    const decodedToken = decodeToken(token)

    return {
      props: {
        token,
        organization: decodedToken,
        data: data?.devices
      }
    }
  } catch (error) {
    return { props: {} }
  }
})
