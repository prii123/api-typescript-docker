import mongoose, { Schema, model } from "mongoose";

export interface IEmpresa extends mongoose.Document {
  creadorId: string;
  razonSocial: string;
  nit: number;
  digitoVerificacion: number;
  direccion: string;
  ciudad: string;
  body: string;
  logo: string;
}

const empresaSchema = new Schema(
  {
    creadorId: {
      type: String,
      required: true,
    },
    razonSocial: {
      type: String,
      required: true,
    },
    nit: {
      type: Number,
      required: true,
    },
    digitoVerificacion: {
      type: Number,
      required: true,
    },
    direccion: {
      type: String,
    },
    ciudad: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IEmpresa>("Empresa", empresaSchema);