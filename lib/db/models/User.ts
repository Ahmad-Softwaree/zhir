import mongoose, { Schema, models } from "mongoose";

export interface IUser {
  _id: string;
  auth0Id: string;
  coins: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    auth0Id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    coins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
