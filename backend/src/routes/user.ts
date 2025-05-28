import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { jwt, decode, sign, verify } from "hono/jwt";
import { signInSchema, signUpSchema } from "@abhilashdash/medium-common";

export const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

user.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    //take data from FE to BE
    const body = await c.req.json();
    const { success } = signUpSchema.safeParse(body);
    //take the data from the frontend and save it in the database
    if (success) {
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });

      //after adding the user in DDB, use it to return a token to user
      const payload = {
        userId: user.id,
        name: user.name,
      };
      const secret = c.env.JWT_SECRET;
      const token = await sign(payload, secret);

      // return c.json({ jwt: token });
      return c.json({ message: "SignUP successful", jwt: token });
    } else {
      c.status(413);
      return c.json({ message: "Give correct data types" });
    }
  } catch (error) {
    console.log("Error: ", error);
    return c.json({ message: "Kuch toh gadbad hai!", error: error });
  }
});

user.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = signInSchema.safeParse(body);
  try {
      if(success) {
      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
          password: body.password,
        },
      });
      if (!user) {
        c.status(404);
        return c.json({ message: "You need to singup first!" });
      }
      const payload = { userId: user.id };
      const token = await sign(payload, c.env.JWT_SECRET);
  
      return c.json({ jwt: token });
  } else {
    c.status(411);
    return c.json({ message: "Give correct data types" });
  }
  } catch (error) {
    c.status(411);
    console.log("Error: ", error);
    return c.json({ message: "Error in singning in" });
  }
});
