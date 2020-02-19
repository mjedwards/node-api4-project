const express = require("express");

const server = express();

const postRoute = require("./posts/postRouter");
const userRoute = require("./users/userRouter");

server.use(express.json());

server.use("/posts", postRoute);
server.use("/users", userRoute);
server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>API deployed!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(req);
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      "User-Agent"
    )}`
  );
  next();
}
// server.use(logger);

module.exports = server;
