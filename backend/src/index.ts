import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

export interface Env {
  DATABASE_URL: string;
}

app.use("/api/v1/blog/*", async (c, next) => {
  const userToken = c.req.header("Authorization");
  if (!userToken) {
    c.status(401);
    return c.json({ message: "Not Authorized" });
  }
  const token = userToken.split(" ")[1]; //["Bearer", "Token"]
  const response = await verify(token, c.env.JWT_SECRET);
  if(!response.id) {
    c.status(401);
    return c.json({msg: "Not authorized"});
  }
  next();
})

app.post("/api/v1/signup", async (c) => {
  try {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())

    //take data from FE to BE 
    const body = await c.req.json();

    //take the data from teh frontend and save it in the database
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password
      }
    })

    //after adding the user in DDB, use it to retrun a token to user
    const payload = {
      userId: user.id
    }
    const secret = c.env.JWT_SECRET
    const token = await sign(payload, secret)

    return c.json({ jwt: token });
  } catch (error) {
    console.log("Error: ", error);
    return c.json({ message: "Kuch toh gadbad hai!" })
  }
})

app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    }
  })
  if (!user) {
    return c.json({ message: "You need to singup first!" })
  }
  const payload = { userId: user.id }
  const token = sign(payload, c.env.JWT_SECRET);

  return c.json({ jwt: token });
})

app.post("/api/v1/blog", (c) => {
  return c.text("token")

})

app.put("api/v1/blog", (c) => {
  return c.text("token")

})

app.get("/api/v1/blog/:id", (c) => {
  return c.text("token")

})

export default app