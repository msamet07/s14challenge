// serverı buraya yazın ve index.js require yazın
const express = require("express");
const server = express();

const projectRouter = require("./project/router");
const resourceRouter = require("./resource/router");
const taskRouter = require("./task/router");

server.use(express.json());

server.use("/api/projects",projectRouter);
server.use("/api/resources",resourceRouter);
server.use("/api/tasks",taskRouter);

module.exports = server;