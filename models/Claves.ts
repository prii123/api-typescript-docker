import mongoose, { Schema, model } from 'mongoose';

export interface IClaves extends mongoose.Document {
  empresaId: string;
  userId: string;
  entidad: string;
  usuario: string;
  contrasenna: string;
  comentario: string;
  plus: string;
}

const clavesSchema = new Schema(
  {
    empresaId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    entidad: {
      type: String,
      required: false,
    },
    usuario: {
      type: String,
      required: false,
    },
    contrasenna: {
      type: String,
      required: false,
    },
    comentario: {
      type: String,
      required: false,
    },
    plus: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IClaves>('Claves', clavesSchema);
