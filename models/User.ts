import mongoose, { Schema, model } from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  foto: string;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Provide a valid email",
      ],
    },
    displayName: {
      type: String,
      required: false,
    },
    foto: {
      type: String
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IUser>("User", userSchema);