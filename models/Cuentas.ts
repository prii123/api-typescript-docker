import mongoose, { Schema, model } from "mongoose";
import SubCuentas from "./SubCuentas";

export interface ICuentas extends mongoose.Document {
  userId: string;
  empresaId: string;
  cuentas: string;
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
    cuentas: {
      type: String,
      maxLength: 4,
      minLength: 4,
      required: true,
    },

    nombre: {
      type: String,
      required: true,
    },
    saldo: {
      type: Number,
    },
    subcuentas: [{ type: Schema.Types.ObjectId, ref: "SubCuentas" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<ICuentas>("Cuentas", userSchema);
