import {GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql';

import { UserType, EmpresaType, CommentType } from "./types";
import User, { IUser } from "../models/User";
import Empresa from "../models/Empresa";
import Comment,{IComment} from "../models/Comment";

export const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves a list of users",
  resolve: () => User.find(),
};

export const user = {
  type: UserType,
  description: "retrieves a single user",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent:any, { id }:any) => User.findById(id),
};

export const empresas = {
  type: new GraphQLList(EmpresaType),
  description: "retrieves a list of empresas",
  resolve: (parent:any, args:any,  { verifiedUser }:any) => {
    if (!verifiedUser) return "No user found";
      return Empresa.find();
  }
};

export const empresa = {
  type: EmpresaType,
  description: "retrieves a single empresa",
  args: { id: { type: GraphQLID } },
  resolve: (parent:any, { id }:any) => Empresa.findById(id),
};

export const comments = {
  type: new GraphQLList(CommentType),
  description: "Retrieves list of commnets",
  resolve: () => Comment.find(),
};

export const comment = {
  type: CommentType,
  description: "Retrieves a single comment",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent:any, { id }:any) => Comment.findById(id),
};

