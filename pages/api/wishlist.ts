// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mongooseConnect } from "@/lib/mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await mongooseConnect();
  const userData = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { product } = req.body;
    const wishedDoc = await WishedProduct.findOne({
      userEmail: userData?.user?.email,
      product,
    });
    if (wishedDoc) await WishedProduct.findByIdAndDelete(wishedDoc._id);
    else
      await WishedProduct.create({
        userEmail: userData?.user?.email,
        product,
      });

    res.status(200).json({ message: "success" });
  }
  if (req.method === "GET") {
    const wishedProducts = await WishedProduct.find({
      userEmail: userData?.user?.email,
    }).populate("product");
    res.status(200).json(wishedProducts);
  }
};

export default handler;
