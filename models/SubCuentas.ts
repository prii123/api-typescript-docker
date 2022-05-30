import mongoose, { Schema, model } from "mongoose";

export interface ISubCuentas extends mongoose.Document {
  userId: string;
  cuentaId: string;
  empresaId: string;
  subcuentas: string;
  nombre: string;
  Saldo: Number;
}

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cuentaId: {
      type: String,
    },
    subcuentas: {
      type: String,
      maxLength: 6,
      minLength: 6,
      required: true,
    },

    nombre: {
      type: String,
      required: true,
    },
    saldo: {
      type: Number,
    },
    auxiliares: [{ type: Schema.Types.ObjectId, ref: 'Auxiliares' }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<ISubCuentas>("SubCuentas", userSchema);
