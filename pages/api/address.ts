// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mongooseConnect } from "@/lib/mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Address } from "@/models/address";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await mongooseConnect();
  const userData = await getServerSession(req, res, authOptions);
  const address = await Address.findOne({ userEmail: userData?.user?.email });

  if (req.method === "PUT") {
    if (address) {
      res.json(await Address.findByIdAndUpdate(address._id, req.body));
    } else {
      res.json(
        await Address.create({ userEmail: userData?.user?.email, ...req.body })
      );
    }
  }
  if (req.method === "GET") {
    res.json(address);
  }
};

export default handler;
