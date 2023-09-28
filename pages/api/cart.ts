import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await mongooseConnect();
  const ids = req.body.ids;

  res.json(await Product.find({ _id: ids }));
};

export default handler;
