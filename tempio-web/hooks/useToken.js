const useToken = token => {
  if (!token) {
    localStorage.setItem('jwtoken', token)
    return true
  }

  token = localStorage.getItem('jwtoken')

  return token
}

export default useToken
