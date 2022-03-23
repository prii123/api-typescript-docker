import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { schema } from "../graphql/schema";
import conction from "../db";
import morgan from "morgan";
import { authenticate } from "../middleware/veryfy";
import {login} from '../middleware/auth'

export type login=void

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }
  config() {
    this.app.set("port", process.env.PORT || 4000);
    conction.connectDB();
    this.app.use(cors());
    // this.app.use(authenticate);
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    
  }

  routes() {
    this.app.get('/', (req, res) => {
      res.send('Hello World');
  });
    this.app.post("/login",login);
    this.app.use(
    "/graphql",
    authenticate,
    graphqlHTTP({
        schema,
        graphiql: true,
      })
    );
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
