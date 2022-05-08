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
    auxiliares: {
      type: String,
      maxLength: 8,
      minLength: 8,
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
