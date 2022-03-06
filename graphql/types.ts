import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import User, { IUser } from "../models/User";
import Comment,{IComment} from "../models/Comment";
import Impuestos, {IImpuestos} from "../models/Impuestos";
import Claves, {IClaves} from "../models/Claves";

import {ImpuestosType} from "./typesImp";


export const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
  }),
});

export const EmpresaType = new GraphQLObjectType({
  name: "Empresa",
  description: "Empresa Type",
  fields: () => ({
    id: { type: GraphQLID },
    razonSocial: { type: GraphQLString },
    nit: { type: GraphQLString },
    body: { type: GraphQLString },
    digitoVerificacion: { type: GraphQLString },
    direccion: { type: GraphQLString },
    ciudad: { type: GraphQLString },
    creador: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.creadorId);
      },
    },
    responsabilidad: {
      type: new GraphQLList(ImpuestosType),
      resolve(parent) {
        // console.log(parent._id)
        return Impuestos.find({ empresaId: parent.id });
      },
    },
    claves: {
      type: new GraphQLList(ClavesType),
      resolve(parent){
        return Claves.find({empresaId: parent.id})
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent) {
        return Comment.find({ postId: parent.id });
      },
    },
  }),
});

export const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "comments type",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId);
      },
    },
  }),
});

export const ClavesType = new GraphQLObjectType({
  name: "Claves",
  description: "Claves type",
  fields: () => ({
    id: { type: GraphQLID },
    entidad: { type: GraphQLString },
    usuario: { type: GraphQLString },
    contrasenna: { type: GraphQLString },
    comentario: { type: GraphQLString },
    plus: { type: GraphQLString },
  }),
});





