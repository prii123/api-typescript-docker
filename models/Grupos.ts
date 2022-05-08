import mongoose, { Schema, model, ObjectId } from "mongoose";
import Clases from "./Clases";

export interface IGrupos extends mongoose.Document {
  userId: string;
  empresaId: string;
  grupo: string;
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
    grupo: {
      type: String,
      maxLength: 2,
      minLength: 2,
      required: true,
    },

    nombre: {
      type: String,
      required: true,
    },
    saldo: {
      type: Number,
    },
    cuentas: [{ type: Schema.Types.ObjectId, ref: "Cuentas" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IGrupos>("Grupos", userSchema);
