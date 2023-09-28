import { ObjectId } from "mongodb";
import { productSchemaType } from "./models/product";

export type reactChildren = {
  children: JSX.Element;
  readonly primary?: boolean;
};

export type ButtonStyleProps = {
  readonly white?: boolean;
  readonly outline?: boolean;
  readonly whiteOnWhite?: boolean;
  readonly primary?: boolean;
  readonly block?: boolean;
  size?: "l" | "m" | "s";
};

export type categoryPropertiesType = {
  name: string;
  values: string | string[];
};

export type productPropertiesType = {
  [key: string]: string;
};

export type categoryProductsType = {
  [key: string]: productSchemaType[];
};

export type filterValuesTypes = {
  [key: string]: string;
};
