import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await mongooseConnect();
  const { categoryIds, sort, phrase, ...filters } = req.query;

  const query: any = {};
  if (categoryIds) query["category"] = (categoryIds as string).split(",");
  if (phrase) {
    query["$or"] = [
      { title: { $regex: phrase, $options: "i" } },
      { description: { $regex: phrase, $options: "i" } },
    ];
  }

  const [sortField, sortOrder] = (sort as string)?.split("-") || ["_id", "asc"];
  if (Object.keys(filters).length) {
    Object.entries(filters).forEach(([name, val]) => {
      query[`properties.${name}`] = val;
    });
  }

  const data = await Product.find(query, null, {
    sort: { [sortField]: sortOrder === "asc" ? 1 : -1 },
  });
  res.json(data);
};

export default handler;
