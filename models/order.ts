import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models, mongo } from "mongoose";

export type orderSchemaType = {
  _id?: ObjectId;
  userEmail: string;
  cartItems: Object[];
  name: string;
  email: string;
  city: string;
  streetAdd: string;
  postalCode: string;
  paid: boolean;
  createdAt: string;
};

const OderSchema = new Schema<orderSchemaType>(
  {
    userEmail: String,
    cartItems: Object,
    name: String,
    email: String,
    city: String,
    streetAdd: String,
    postalCode: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Order = models.Order || model("Order", OderSchema);
