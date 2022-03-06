import mongoose, { Schema, model } from "mongoose";

export interface IImpuestos extends mongoose.Document {
  empresaId: string;
  impuesto: string;
  responsabilidad: string;
  comentario: string;
}

const impuestosSchema = new Schema(
  {
    empresaId: {
      type: String,
      required: true,
    },
    impuesto: {
      type: String,
      required: false,
    },
    responsabilidad: {
      type: Number,
      required: false,
    },
    comentario: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IImpuestos>("Impuestos", impuestosSchema);