import express, { Router } from "express";

const usersRouters = Router();

// * GET all users, get by id , create user, update user, delete user

usersRouters.get("/", (req, res) => {
  res.send("Get all users");
});

usersRouters.get("/:id", (req, res) => {
  res.send(`Get user with id ${req.params.id}`);
});
usersRouters.post("/", (req, res) => {
  res.send("Create a new user");
});

usersRouters.put("/:id", (req, res) => {
  res.send(`Update user with id ${req.params.id}`);
});

usersRouters.delete("/:id", (req, res) => {
  res.send(`Delete user with id ${req.params.id}`);
});



export default usersRouters;