import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";
import { productSchemaType } from "./product";

export type wishedProductSchemaType = {
  _id?: ObjectId;
  userEmail: string;
  product: productSchemaType;
};

const WishedProductSchema = new Schema<wishedProductSchemaType>(
  {
    userEmail: String,
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  {
    timestamps: true,
  }
);

export const WishedProduct =
  models.WishedProduct || model("WishedProduct", WishedProductSchema);
