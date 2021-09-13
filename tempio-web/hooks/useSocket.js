import { io } from "socket.io-client";
import { useEffect, useState } from 'react'

let socketClient = null

function useSocket (id, options = {}) {
  const clientId = `organization:${id}`
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!socketClient) {
      socketClient = io('http://localhost:3001', {
        query: {
          clientId
        }
      })

      socketClient.onAny((event, payload) => {
        options?.onMessage(event, payload)
      })
    }
    setSocket(socketClient)

    return () => {
      socketClient.disconnect()
      socketClient = null
    }
  }, [])

  return socket
}

export default useSocket