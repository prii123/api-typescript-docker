import mongoose, { Schema, model } from "mongoose";

export interface IHojaVida extends mongoose.Document {
  userId:string;
  nombre: string;
  fechaDeNacimiento: Date;
  telefono: string;
  correo: string;
  lugarDeNacimiento:string;
  genero: string;
  estadoCivil: string;
  foto: string;
  linkending: string;
  descripcion: string;
  formacion: [{ nivel: string; nombre: string }];
  experiencia: [{ cargo: string; empresa: string; tiempo: string }];
  skills: [{ skill: string }];
}

const hojaDeVida = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    fechaDeNacimiento: {
      type: Date,
      required: false,
    },
    lugarDeNacimiento: {
      type: String,
      required: false,
    },
    telefono: {
      type: String,
      required: false,
    },
    correo: {
      type: String,
      required: false,
    },
    genero: {
      type: String,
      required: false,
    },
    estadoCivil: {
      type: String,
      required: false,
    },
    foto: {
      type: String,
      required: false,
    },
    linkending: {
      type: String,
      required: false,
    },
    descripcion: {
      type: String,
      required: false,
    },
    formacion: {
      type: [],
      required: false,
    },
    experiencia: {
      type: [],
      required: false,
    },
    skills: {
      type: [],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IHojaVida>("HojaVida", hojaDeVida);
