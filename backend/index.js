import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import mergeResolvers from "./resolvers/index.js"
import mergeTypeDefs from "./typedefs/index.js";
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";
import{connectDB} from "./db/connectDB.js"

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import {buildContext} from "graphql-passport";
import {configurePassport} from './passport/passport.config.js'
const app = express();
const httpServer = http.createServer(app);
dotenv.config(); // if we don't have cannot use environment variables
const MongoDBStore = connectMongo(session)
configurePassport();
const store = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection: "sessions",
})

store.on("error", (err) => {
    console.log(err);
})
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, // this option specifies whether to save the session to the store on every request, if we say true, then we would have multiple sessions for the same user
        saveUninitialized: false, // option specifies whether to save unitialized sessions
        cookie:{
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true, // this option prevents the Cross - Site scripting (XSS) attacks
        },
        store: store
    }
)
)
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs: mergeTypeDefs,
    resolvers: mergeResolvers,
    puglins: [ApolloServerPluginDrainHttpServer({httpServer})]
});


await server.start();
app.use(
    '/',
    cors({
        origin: "http://localhost:3000",
        credientials: true,
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => buildContext({req,res}), // obkect thats saved across all the resolvers
    }),
  );
  
  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  await connectDB();
  console.log(`🚀 Server ready at http://localhost:4000/`);
  