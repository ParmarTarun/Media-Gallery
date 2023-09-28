import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

export type addressSchemaType = {
  _id?: ObjectId;
  userEmail: string;
  name: string;
  email: string;
  streetAdd: string;
  city: string;
  postalCode: string;
};

const addressSchema = new Schema<addressSchemaType>({
  userEmail: { type: String, unique: true, required: true },
  name: String,
  email: String,
  streetAdd: String,
  city: String,
  postalCode: String,
});

export const Address = models?.Address || model("Address", addressSchema);
