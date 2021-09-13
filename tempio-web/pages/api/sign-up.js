import axios from 'axios'
import withSession from 'libs/session'

export default withSession(async (req, res) => {
  try {
    const body = await req.body
    const { data } = await axios.post('http://localhost:3001/api/sign-up', body)
    req.session.set('token', data.token)
    await req.session.save()
    res.json(data)
  } catch (error) {
    const { response } = error
    res
      .status(response?.status || 500)
      .json(error.data)
  }
})
