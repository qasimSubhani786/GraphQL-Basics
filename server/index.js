const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
type User {
id:ID!
name:String!
username:String!
email:String!
phone:String!
website:String!
}

type Todo {
id:ID!
title:String!
completed: Boolean
user:User
}

type Query {
getTodos:[Todo]
getAllUsers:[User]
getUser(id:ID!):User
}`,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },

      Query: {
        getTodos: async () => {
          const data = (
            await axios.get("https://jsonplaceholder.typicode.com/todos")
          ).data;

          return data;
        },
        getAllUsers: async () => {
          const data = (
            await axios.get("https://jsonplaceholder.typicode.com/users")
          ).data;

          return data;
        },
        getUser: async (parent, { id }) => {
          const data = (
            await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
          ).data;

          return data;
        },
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("Server started at port 8000"));
}

startServer();
