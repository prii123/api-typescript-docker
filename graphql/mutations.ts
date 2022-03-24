import {
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull
} from "graphql"
import User, { IUser } from "../models/User";
import Empresa, {IEmpresa} from "../models/Empresa";
import Comment,{IComment} from "../models/Comment";
import Impuestos, {IImpuestos} from "../models/Impuestos";
import Claves, {IClaves} from "../models/Claves";

import {createJWTToken} from "../util/auth";
import {encryptPassword, comparePassword} from "../util/bcrypt";
import {
  EmpresaType,
  CommentType,
  ClavesType,
} from "./types";
import {ImpuestosType} from "./typesImp";

export const register = {
  type: GraphQLString,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    displayName: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent: any, args:any) {

    const {username, email, password, displayName } = args;
    const user: IUser = new User({ username, email, password, displayName });
    user.password = await encryptPassword(user.password);
    await user.save();
    
    const token = createJWTToken({
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
    });
    return token;
  },
};

export const login = {
  type: GraphQLString,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent:any, args:any) {
    const { email, password } = args;
    const user = await User.findOne({ email }).select("+password");

    // if (!user) throw new Error("Invalid Username");
    if (!user) return "Invalid";

    const validPassword = await comparePassword(password, user.password);

    // if (!validPassword) throw new Error("Invalid Password");
    if (!validPassword) return "Invalid";

    const token = createJWTToken({
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
    });

    const data = token + " " + user.email;

    return data;
  },
};

export const createEmpresa = {
  type: EmpresaType,
  description: "create a new empresa",
  args: {
    razonSocial: { type: new GraphQLNonNull(GraphQLString) },
    nit: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    digitoVerificacion: { type: new GraphQLNonNull(GraphQLString) },
    direccion: { type: new GraphQLNonNull(GraphQLString) },
    ciudad: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent:any, args:any, { verifiedUser }:any) {
    if (!verifiedUser) throw new Error("You must be logged in to do that");
    const userFound = await User.findById(verifiedUser._id);

    if (!userFound) throw new Error("Unauthorized");

    const post = new Empresa({
      creadorId: verifiedUser._id,
      razonSocial: args.razonSocial,
      body: args.body,
      nit: args.nit,
      digitoVerificacion: args.digitoVerificacion,
      direccion: args.direccion,
      ciudad: args.ciudad,
    });

    return post.save();
  },
};

export const updateEmpresa = {
  type: EmpresaType,
  description: "update a Empresa",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    body: { type: GraphQLString },

    direccion: { type: new GraphQLNonNull(GraphQLString) },
    ciudad: { type: new GraphQLNonNull(GraphQLString) },
    razonSocial: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(
    parent:any,
    { id, direccion, ciudad, body, razonSocial }:any,
    { verifiedUser }:any
  ) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const empresaUpdated = await Empresa.findOneAndUpdate(
      { _id: id }, // , authorId: verifiedUser._id
      { direccion, body, ciudad, razonSocial },
      {
        new: true,
        //runValidators: true,
      }
    );

    if (!empresaUpdated) throw new Error("No empresa for given id");

    return empresaUpdated;
  },
};

// Mutacion de impuestos
export const createImpuesto = {
  type: ImpuestosType,
  description: "creater nuevo impuesto",
  args: {
    empresaId: { type: new GraphQLNonNull(GraphQLID) },
    impuesto: { type: new GraphQLNonNull(GraphQLString) },
    responsabilidad: { type: new GraphQLNonNull(GraphQLInt) },
    comentario: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(
    parent:any,
    { empresaId, impuesto, responsabilidad, comentario }:any,
    { verifiedUser }:any
  ) {
    if (!verifiedUser) throw new Error("You must be logged in to do that");

    const post: IImpuestos = new Impuestos({
      empresaId,
      impuesto,
      responsabilidad,
      comentario
    });

    return post.save();
  },
};
export const modificarComentarioImpuesto = {
  type: ImpuestosType,
  description: "creater nuevo impuesto",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    comentario: { type: new GraphQLNonNull(GraphQLString) },
  },
 async resolve(
    parent:any,
    { id, comentario }:any,
    { verifiedUser }:any
  ) {
    if (!verifiedUser) throw new Error("You must be logged in to do that");

    const post = await Impuestos.findByIdAndUpdate(
      {_id: id},
      {comentario}, {
      new: true,
      runValidators: true,
    });

    if (!post) throw new Error("No comment with the given ID");

    return post
  },
};

//mutacion de claves
export const createClave = {
  type: ClavesType,
  description: "creater nuevo impuesto",
  args: {
    empresaId: { type: GraphQLID },
    entidad: { type: GraphQLString },
    usuario: { type: GraphQLString },
    contrasenna: { type: GraphQLString },
    comentario: { type: GraphQLString },
    plus: { type: GraphQLString },
  },
  resolve(
    parent:any,
    { empresaId, entidad, usuario, contrasenna, comentario, plus }:any,
    { verifiedUser }:any
  ) {
    if (!verifiedUser) throw new Error("You must be logged in to do that");

    const post: IClaves = new Claves({
      userId: verifiedUser._id,
      empresaId,
      entidad,
      usuario,
      contrasenna,
      comentario,
      plus,
    });

    return post.save();
  },
};

export const actualizarClaves = {
  type: ClavesType,
  description: "actualizar claves",
  args: {
    id: { type: GraphQLID },
    entidad: { type: GraphQLString },
    usuario: { type: GraphQLString },
    contrasenna: { type: GraphQLString },
    comentario: { type: GraphQLString },
    plus: { type: GraphQLString },
  },
  async resolve(
    parent:any,
    { id, entidad, usuario, contrasenna, comentario, plus }:any,
    { verifiedUser }:any
  ) {
    const claveActualizada = await Claves.findByIdAndUpdate(
      {
        _id: id,
        userId: verifiedUser._id,
      },
      {
        entidad,
        usuario,
        contrasenna,
        comentario,
        plus
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!claveActualizada) throw new Error("No comment with the given ID");

    return claveActualizada;
  },
};

export const addComment = {
  type: CommentType,
  description: "Create a new comment for a blog post",
  args: {
    comment: { type: new GraphQLNonNull(GraphQLString) },
    postId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(parent:any, { postId, comment }:any, { verifiedUser }:any) {
    const newComment: IComment = new Comment({
      userId: verifiedUser._id,
      postId,
      comment,
    });
    return newComment.save();
  },
};

export const updateComment = {
  type: CommentType,
  description: "update a comment",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    comment: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent:any, { id, comment }:any, { verifiedUser }:any) {
    if (!verifiedUser) throw new Error("UnAuthorized");

    const commentUpdated = await Comment.findOneAndUpdate(
      {
        _id: id,
        userId: verifiedUser._id,
      },
      {
        comment,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!commentUpdated) throw new Error("No comment with the given ID");

    return commentUpdated;
  },
};

export const deleteComment = {
  type: GraphQLString,
  description: "delete a comment",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent:any, { id }:any, { verifiedUser }:any) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const commentDelete = await Comment.findOneAndDelete({
      _id: id,
      userId: verifiedUser._id,
    });

    if (!commentDelete)
      throw new Error("No comment with the given ID for the user");

    return "Comment deleted";
  },
};


