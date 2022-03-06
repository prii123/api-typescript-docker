import mongoose, { Schema, model } from "mongoose";

export interface IComment extends mongoose.Document {
  comment: string;
  userId: string;
  postId: string;
}

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IComment>("Comment", commentSchema);