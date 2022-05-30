import mongoose, { Schema, model } from "mongoose";

export interface IAuxiliares extends mongoose.Document {
  userId: string;
  empresaId: string;
  auxiliares: string;
  nombre: string;
  tercero: string;
  saldo: Number;
}

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    empresaId: {
      type: String,
      required: true,
    },
    clase: {
      type: String,
      maxLength: 1,
      minLength: 1,
      required: true,
    },
    grupo: {
      type: String,
      maxLength: 2,
      minLength: 2,
      required: true,
    },
    cuenta: {
      type: String,
      maxLength: 4,
      minLength: 4,
      required: true,
    },
    subcuenta: {
      type: String,
      maxLength: 6,
      minLength: 6,
      required: true,
    },
    auxiliares: {
      type: String,
      maxLength: 9,
      minLength: 9,
      required: true,
    },

    nombre: {
      type: String,
      required: true,
    },
    tercero: {
      type: String,
      required: true,
    },
    saldo: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IAuxiliares>("Auxiliares", userSchema);
