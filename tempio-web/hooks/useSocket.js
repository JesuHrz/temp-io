import { useEffect, useState } from 'react'
import io from 'socket.io-client'

function useSocket ({ url, id }) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIo = io(url, {
      query: {
        id
      }
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [])

  return socket
}

export default useSocket