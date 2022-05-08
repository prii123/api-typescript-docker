import mongoose, { Schema, model } from "mongoose";
import Grupos from "./Grupos";

export interface IClases extends mongoose.Document {
  userId: string;
  grupoId: string;
  empresaId: string;
  clase: string;
  nombre: string;
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
      required: true,
    },

    nombre: {
      type: String,
      required: true,
    },
    grupos: [{ type: Schema.Types.ObjectId, ref: 'Grupos' }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IClases>("Clases", userSchema);
