import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    authorId: string;
  };
}>();

//used to protect the blog routes. Only the authorized users can see the blogs
blog.use("/*", async (c, next) => {
  //take the token from the usr from header and return the authorId
  const token = c.req.header("authorization") || "";
  console.log("token: ",token);
  const decodedToken = await verify(token, c.env.JWT_SECRET);
  console.log("decodedToken ",decodedToken);
  if (decodedToken) {
    const authorId = decodedToken.userId as string;
    c.set("authorId", authorId);
    console.log("decodedToken.id: ", decodedToken.userId);
    await next();
  } else {
    c.status(401);
    return c.json({ msg: "Bad request. You are not authenticated" });
  }
  return c.json({ message: "Protected Routes" });
});

blog.post("/", async (c) => {
  //take the blog posts from body and store into DB
  const prisma = new PrismaClient( {datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const userId = c.get("authorId");
    console.log("userId as number", Number(userId));
    console.log("userId as parseInt", parseInt(userId));

    const blogByUser = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(userId),
      },
    });

    //taking the id from body???
    return c.json({ message: "Blog created", id: blogByUser.id });
  } catch (error) {
    c.status(411);
    return c.json({ msg: "Blog didn't get created", error: error });
  }
});

//update a blog
blog.put("/", async (c) => {
  const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  //take the data to be updated from body
  const body = await c.req.json();
  try {
    const updatedBlog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        authorId: 1,
      },
    });
    return c.json({ msg: "Blog updated", id: body.id });
  } catch (error) {
    c.status(411);
    return c.json({ msg: "Error in updating the blog" });
  }
});

//all the blogs that exist, only the title, to be shown on the landing page, add pagination(reveal the blogs as the user scrolls)
//this is written before the /:id endppoint as writing it after the /:id endpoint causing it to read the endpoint as id == bulk which is causing error
blog.get("/bulk", async (c) => {
  const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const blogs = await prisma.blog.findMany()
  return c.json({ blogs: blogs });
});
blog.get("/:id", async (c) => {
  const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const id = c.req.param("id");
  try {
    const fetchedBlog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
    });
    return c.json({
      msg: "Successful in fetching the blog",
      blog: fetchedBlog,
    });
  } catch (error) {
    c.status(413);
    return c.json({ msg: "Error in fetching the blog" });
  }
});

