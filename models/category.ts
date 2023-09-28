import { categoryPropertiesType } from "@/types";
import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

export type categorySchemaType = {
  _id?: ObjectId;
  name: string;
  parentCategory?: categorySchemaType;
  properties: categoryPropertiesType[];
};

const categorySchema = new Schema<categorySchemaType>({
  name: { type: String, required: true },
  parentCategory: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  properties: {
    type: [{ type: Object }],
  },
});

export const Category = models.Category || model("Category", categorySchema);
