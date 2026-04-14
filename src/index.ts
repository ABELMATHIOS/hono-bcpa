import { Hono } from 'hono'

const app = new Hono()
// This defines the shape of a user
type User = {
  id: string
  name: string
  email: string
  password: string
}

// This is our in-memory list that stores all users
const users: User[] = []

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.get('/users', (c) => {
  return c.json(users)
})
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  const user = users.find((u) => u.id === id)

  if (!user) {
    return c.json({ message: 'User not found' }, 404)
  }

  return c.json(user)
})
app.post('/signup', async (c) => {
  const body = await c.req.json()

  const newUser: User = {
    id: String(users.length + 1),
    name: body.name,
    email: body.email,
    password: body.password
  }

  users.push(newUser)

  return c.json({ message: 'User created!', user: newUser }, 201)
})
app.post('/signin', async (c) => {
  const body = await c.req.json()

  const user = users.find((u) => u.email === body.email)

  if (!user) {
    return c.json({ message: 'User not found' }, 404)
  }

  if (user.password !== body.password) {
    return c.json({ message: 'Invalid password' }, 401)
  }

  return c.json({ message: 'Login successful!', user: user }, 200)
})
export default app
