import { GraphQLSchema, GraphQLObjectType } from "graphql";

// Queries
import { users, user, empresas, empresa, comments, comment } from "./queries";

// Mutations
import {
  register,
  modificarUsuario,
  login,
  createEmpresa,
  addComment,
  updateEmpresa,
  updateComment,
  deleteComment,
  createImpuesto,
  modificarComentarioImpuesto,
  createClave,
  actualizarClaves
} from "./mutations";

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: {
    users,
    user,
    empresas,
    empresa,
    comments,
    comment,
  },
});

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    register, //crear usuario
    modificarUsuario, // modificar usuario
    login,
    createEmpresa,
    addComment,
    updateEmpresa,
    updateComment,
    deleteComment,

    createImpuesto,
    modificarComentarioImpuesto,
    createClave,
    actualizarClaves
  },
});


export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

