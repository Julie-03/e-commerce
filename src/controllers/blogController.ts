import express, { Request, Response } from "express";

let blogs = [
  {
    id: 1,
    title: "First Blog",
    description: "This is the first blog",
  },
  {
    id: 2,
    title: "Second Blog",
    description: "This is the second blog",
  },
  {
    id: 3,
    title: "Third Blog",
    description: "This is the third blog",
  },
];

function getAllBlogs(req: Request, res: Response) {
  console.log(" APPLICATION NAME ", req.body.applicationName);

  res.json({
    status: "success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
}

function getBlogById(req: Request, res: Response) {
  const blog = blogs.find((b) => b.id === parseInt(req.params.id));
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).send("Blog not found");
  }
}

function createBlog(req: Request, res: Response) {
  console.log(" REQUEST DATA", req.body);

  //  validations on the request body

  if (req.body.title == "" || req.body.description == "") {
    return res.status(400).json({
      status: "Fail",
      message: "Title and Description are required",
    });
  }

  // descriptions for post
  if (req.body.description.length < 10) {
    return res.status(400).json({
      status: "Fail",
      message: "Description should be at least 10 characters long",
    });
  }
  // title  exist and is a string

  if (blogs.find((b) => b.title === req.body.title)) {
    return res.status(400).json({
      status: "Fail",
      message: "Post with the same title already exists",
    });
  }
  const newBlog = {
    id: blogs.length + 1,
    title: req.body.title,
    description: req.body.description,
  };
  blogs.push(newBlog);
  res.status(201).json("Blog created successfully");
}

function updateBlog(req: Request, res: Response) {
  const blog = blogs.find((b) => b.id === parseInt(req.params.id));
  if (blog) {
    blog.title = req.body.title || blog.title;
    blog.description = req.body.description || blog.description;
    res.json(blog);
  } else {
    res.status(404).send("Blog not found");
  }
}

function deleteBlog(req: Request, res: Response) {
  const blogIndex = blogs.findIndex((b) => b.id === parseInt(req.params.id));
  if (blogIndex !== -1) {
    blogs.splice(blogIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Blog not found");
  }
}

export { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };