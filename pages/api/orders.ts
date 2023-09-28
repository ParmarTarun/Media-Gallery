// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mongooseConnect } from "@/lib/mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Order } from "@/models/order";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await mongooseConnect();
  const userData = await getServerSession(req, res, authOptions);
  if (userData?.user?.email) {
    res.json(await Order.find({ userEmail: userData.user.email }));
  }
};

export default handler;
