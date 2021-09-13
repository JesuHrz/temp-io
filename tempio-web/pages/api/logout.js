import withSession from 'libs/session'

export default withSession(async (req, res) => {
  req.session.destroy()
  res.json(201)
})
