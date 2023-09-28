import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models, mongo } from "mongoose";
import { categorySchemaType } from "./category";
import { productPropertiesType } from "@/types";

export type productSchemaType = {
  _id?: ObjectId;
  title: string;
  description: string;
  price: number;
  category: categorySchemaType;
  properties: productPropertiesType;
  images: string[];
};

const ProductSchema = new Schema<productSchemaType>(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    properties: { type: Object },
    images: { type: [String] },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", ProductSchema);
