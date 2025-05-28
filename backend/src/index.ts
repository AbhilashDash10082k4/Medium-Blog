import { Hono } from 'hono'
import { user } from './routes/user'
import { blog } from './routes/blog'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

export interface Env {
  DATABASE_URL: string;
}

//all user/blog requests should go to a user/blog router 
app.route('/api/v1/user', user)
app.route('/api/v1/blog', blog);

export default app