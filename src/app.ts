import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { schema } from "../graphql/schema";
import conction from "../db";
import morgan from "morgan";
import { authenticate } from "../middleware/veryfy";
import {login} from '../middleware/auth'


import Auxiares from '../controllers/AuxiliarController'
import SubCuentas from '../controllers/SubCuentaController';
import Cuenta from '../controllers/CuentaController'
import Grupo from '../controllers/GrupoController'
import Clases from '../controllers/ClaseController'
import Empresas from "../controllers/EmpresasController";
import Usuario from "../controllers/Usuario";

// export type login=void

//creacion del servidor por medio de una clase
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

    // estas son las rutas que funcionan sin graphQL
    this.app.post("/login",login);
    this.app.use('/api', Usuario); //usuarios
    this.app.use('/api', Empresas); //empresas
    this.app.use('/api', Clases); // clases
    this.app.use('/api', Grupo); //Grupo
    this.app.use('/api', Cuenta); //cuentas
    this.app.use('/api', SubCuentas); //subcuentas
    this.app.use('/api', Auxiares); //cuentas auxiliares

    // estas son las rutas que especificamente utilizan graphQL
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
