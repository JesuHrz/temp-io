import { io } from "socket.io-client";
import { useEffect, useState } from 'react'

function useSocket (id, options = {}) {
  const clientId = `organization:${id}`
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketClient = io('http://localhost:3001', {
      query: {
        clientId
      }
    })

    socketClient.onAny((event, data) => {
      options?.onMessage(event, data)
    })

    setSocket(socketClient)
  }, [])

  return socket
}

export default useSocket